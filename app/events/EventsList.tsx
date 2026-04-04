'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { EventCard, Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LikeButton } from '@/components/ui/LikeButton'
import Image from 'next/image'
import type { Event } from '@/types/event'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface University {
    id: string
    name: string
    shortName: string
}

interface EventsListProps {
    initialEvents: Event[]
    currentUserId?: string
    universities: University[]
    isAuthenticated: boolean
}

type SortBy = 'recent' | 'happening'

export function EventsList({ initialEvents, currentUserId, universities, isAuthenticated }: EventsListProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(isAuthenticated && initialEvents.length >= 4)
    const [lastScrollY, setLastScrollY] = useState(0)
    const loadingRef = useRef(false)

    // Filter state
    const [selectedUniId, setSelectedUniId] = useState<string>('')
    const [sortBy, setSortBy] = useState<SortBy>('recent')
    const [isFiltering, setIsFiltering] = useState(false)
    const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

    const toggleExpand = (eventId: string) => {
        setExpandedEvents(prev => {
            const next = new Set(prev)
            if (next.has(eventId)) {
                next.delete(eventId)
            } else {
                next.add(eventId)
            }
            return next
        })
    }

    const buildFetchUrl = useCallback((skip: number) => {
        const params = new URLSearchParams({
            take: '4',
            skip: String(skip),
        })
        if (selectedUniId) params.set('uniId', selectedUniId)
        if (sortBy !== 'recent') params.set('sortBy', sortBy)
        return `/api/events/list?${params.toString()}`
    }, [selectedUniId, sortBy])

    // Re-fetch events when filters change (only for authenticated users)
    useEffect(() => {
        if (!isAuthenticated) return

        const fetchFiltered = async () => {
            setIsFiltering(true)
            loadingRef.current = true

            try {
                const response = await fetch(buildFetchUrl(0))
                const data = await response.json()

                if (data.events) {
                    setEvents(data.events)
                    setHasMore(data.events.length >= 4)
                }
            } catch (error) {
                console.error('Failed to fetch filtered events:', error)
            } finally {
                setIsFiltering(false)
                loadingRef.current = false
            }
        }

        fetchFiltered()
    }, [selectedUniId, sortBy, buildFetchUrl, isAuthenticated])

    const fetchMoreEvents = async () => {
        if (!isAuthenticated || loadingRef.current || !hasMore) return

        loadingRef.current = true
        setIsLoading(true)

        try {
            const response = await fetch(buildFetchUrl(events.length))
            const data = await response.json()

            if (data.events && data.events.length > 0) {
                setEvents(prev => [...prev, ...data.events])
                setHasMore(data.events.length >= 4)
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('Failed to fetch more events:', error)
        } finally {
            setIsLoading(false)
            loadingRef.current = false
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const scrollingDown = currentScrollY > lastScrollY

            if (!scrollingDown) {
                setLastScrollY(currentScrollY)
                return
            }

            const scrollHeight = document.documentElement.scrollHeight
            const scrollTop = window.scrollY
            const clientHeight = window.innerHeight
            const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)

            if (currentScrollY > 500 && distanceFromBottom < 400 && !loadingRef.current && hasMore) {
                fetchMoreEvents()
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY, hasMore])


    return (
        <>
            {/* Filter Bar — only for authenticated users */}
            {isAuthenticated && (
                <div className="mb-6 p-4 md:p-0 flex flex-col lg:flex-row items-stretch gap-3">
                    <select
                        value={selectedUniId}
                        onChange={(e) => setSelectedUniId(e.target.value)}
                        className="w-full lg:w-auto min-w-[200px] h-11 px-4 text-sm rounded-xl border border-[#E5E5E4] bg-white text-[#4B3621] focus:outline-none focus:ring-2 focus:ring-[#CC5500] transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234B3621%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[position:right_0.75rem_center] bg-no-repeat pr-10"
                    >
                        <option value="">All Universities</option>
                        {universities.map((uni) => (
                            <option key={uni.id} value={uni.id}>
                                {uni.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex h-11 rounded-xl border border-[#E5E5E4] overflow-hidden bg-white lg:flex-none">
                        <button
                            onClick={() => setSortBy('recent')}
                            className={`flex-1 lg:flex-none px-4 lg:px-6 h-full flex items-center justify-center text-sm font-medium transition-colors ${sortBy === 'recent'
                                ? 'bg-[#CC5500] text-white'
                                : 'text-[#4B3621] hover:bg-[#F5F5F4]'
                                }`}
                        >
                            Recently Added
                        </button>
                        <button
                            onClick={() => setSortBy('happening')}
                            className={`flex-1 lg:flex-none px-4 lg:px-6 h-full flex items-center justify-center text-sm font-medium transition-colors border-l border-[#E5E5E4] ${sortBy === 'happening'
                                ? 'bg-[#CC5500] text-white'
                                : 'text-[#4B3621] hover:bg-[#F5F5F4]'
                                }`}
                        >
                            Happening Soon
                        </button>
                    </div>
                </div>
            )}

            {/* Loading overlay for filter changes */}
            {isFiltering && (
                <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-[#CC5500] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading events...</p>
                </div>
            )}

            {/* Empty state */}
            {!isFiltering && events.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F5F4] flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#4B3621] mb-2">
                            {selectedUniId || sortBy !== 'recent' ? 'No events match your filters' : 'No events yet'}
                        </h3>
                        <p className="text-gray-600">
                            {selectedUniId || sortBy !== 'recent'
                                ? 'Try adjusting your filters to see more events.'
                                : 'Be the first to share an event with the community!'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Events List */}
            {!isFiltering && events.length > 0 && (
                <div className="space-y-6 flex flex-col items-center w-full ">
                    {events.map((event, index) => (
                        <EventCard key={event.id} hover className='max-w-full lg:max-w-[40vw] w-full'>
                            {/* SEO: <article> identifies each event as a self-contained piece of content */}
                            <article>
                                <CardContent className="p-0">
                                    <div className="p-3 md:p-6">
                                        <Link href={`/events/${event.id}`}>
                                            {/* Author Info */}
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CC5500] to-[#2D5A27] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                                                    {event.author.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                                        <p className="font-semibold text-[#4B3621] truncate">{event.author.name || 'Anonymous'}</p>
                                                        <Badge variant="default" className="text-xs whitespace-nowrap">
                                                            {event.university.shortName}
                                                        </Badge>
                                                    </div>
                                                    {/* SEO: <time> with ISO dateTime helps crawlers parse event dates */}
                                                    <time dateTime={new Date(event.createdAt).toISOString()} className="text-sm text-gray-500">
                                                        {formatDate(event.createdAt)}
                                                    </time>
                                                </div>
                                            </div>
                                            <h2 className="text-xl md:text-2xl font-bold text-[#4B3621] mb-3 break-words">
                                                {event.title}
                                            </h2>
                                        </Link>
                                        <p className={`text-gray-700 whitespace-pre-wrap leading-relaxed mb-1 text-sm md:text-base ${!expandedEvents.has(event.id) ? 'line-clamp-3' : ''}`}>{event.content}</p>
                                        {event.content.split('\n').length > 3 || event.content.length > 200 ? (
                                            <button
                                                onClick={() => toggleExpand(event.id)}
                                                className="text-[#CC5500] text-sm font-medium hover:underline mb-4 cursor-pointer"
                                            >
                                                {expandedEvents.has(event.id) ? 'See less' : 'See more'}
                                            </button>
                                        ) : <div className="mb-3" />}
                                    </div>
                                    {/* Event Image */}
                                    {event.imagePath && (
                                        <div className="mb-4 overflow-hidden flex items-center justify-center rounded-lg">
                                            <Image
                                                src={event.imagePath}
                                                alt={event.title}
                                                className="w-full h-auto max-h-[50vh] lg:max-w-[50vw] lg:max-h-[70vh] object-contain"
                                                width={1080}
                                                height={1920}
                                                priority={index < 4}
                                            />
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-4 pt-4 border-t border-[#F5F5F4] flex items-center p-6">
                                        <LikeButton
                                            eventId={event.id}
                                            initialLikeCount={event.likeCount}
                                            initialIsLiked={event.isLikedByUser}
                                            currentUserId={currentUserId}
                                        />
                                    </div>
                                </CardContent>
                            </article>
                        </EventCard>
                    ))}
                </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-[#CC5500] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading more events...</p>
                </div>
            )}

            {/* End of Events */}
            {!hasMore && events.length > 0 && !isFiltering && isAuthenticated && (
                <div className="text-center py-8">
                    <p className="text-sm text-gray-500">You&apos;ve reached the end! 🎉</p>
                </div>
            )}

            {/* Sign-in CTA for unauthenticated users */}
            {!isAuthenticated && events.length > 0 && (
                <div className="text-center py-10">
                    <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-[#FFF7ED] to-[#FEF3C7] border border-[#F59E0B]/20">
                        <p className="text-[#4B3621] font-semibold mb-2">Want to see more events?</p>
                        <p className="text-sm text-gray-600 mb-4">Sign in to browse all events and create your own.</p>
                        <a
                            href="/login"
                            className="inline-flex items-center px-6 py-2.5 rounded-xl bg-[#CC5500] text-white font-medium text-sm hover:bg-[#B34C00] transition-colors"
                        >
                            Sign in to continue
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}
