'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Image from 'next/image'
import type { Event } from '@/types/event'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface University {
    id: string
    name: string
    shortName: string
}

interface EventsListProps {
    initialEvents: Event[]
    currentUserId?: string
    universities: University[]
}

type SortBy = 'recent' | 'happening'

export function EventsList({ initialEvents, currentUserId, universities }: EventsListProps) {
    const router = useRouter()
    const [events, setEvents] = useState<Event[]>(initialEvents)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(initialEvents.length >= 4)
    const [lastScrollY, setLastScrollY] = useState(0)
    const loadingRef = useRef(false)

    // Filter state
    const [selectedUniId, setSelectedUniId] = useState<string>('')
    const [sortBy, setSortBy] = useState<SortBy>('recent')
    const [isFiltering, setIsFiltering] = useState(false)

    const buildFetchUrl = useCallback((skip: number) => {
        const params = new URLSearchParams({
            take: '4',
            skip: String(skip),
        })
        if (selectedUniId) params.set('uniId', selectedUniId)
        if (sortBy !== 'recent') params.set('sortBy', sortBy)
        return `/api/events/list?${params.toString()}`
    }, [selectedUniId, sortBy])

    // Re-fetch events when filters change
    useEffect(() => {
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
    }, [selectedUniId, sortBy, buildFetchUrl])

    const fetchMoreEvents = async () => {
        if (loadingRef.current || !hasMore) return

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

    const handleLike = async (eventId: string) => {
        if (!currentUserId) {
            router.push('/login')
            return
        }

        // Optimistic update
        setEvents(prev =>
            prev.map(event => {
                if (event.id !== eventId) return event
                const wasLiked = event.isLikedByUser
                return {
                    ...event,
                    isLikedByUser: !wasLiked,
                    likeCount: wasLiked ? event.likeCount - 1 : event.likeCount + 1,
                }
            })
        )

        try {
            const response = await fetch('/api/events/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId }),
            })

            if (!response.ok) {
                throw new Error('Failed to toggle like')
            }

            const data = await response.json()

            // Sync with server state
            setEvents(prev =>
                prev.map(event =>
                    event.id === eventId
                        ? { ...event, isLikedByUser: data.liked, likeCount: data.likeCount }
                        : event
                )
            )
        } catch {
            // Rollback on failure
            setEvents(prev =>
                prev.map(event => {
                    if (event.id !== eventId) return event
                    const wasLiked = event.isLikedByUser
                    return {
                        ...event,
                        isLikedByUser: !wasLiked,
                        likeCount: wasLiked ? event.likeCount - 1 : event.likeCount + 1,
                    }
                })
            )
        }
    }

    return (
        <>
            {/* Filter Bar */}
            <div className="mb-6 flex flex-col sm:flex-row items-stretch gap-3">
                <select
                    value={selectedUniId}
                    onChange={(e) => setSelectedUniId(e.target.value)}
                    className="w-full sm:w-auto min-w-[200px] h-11 px-4 text-sm rounded-xl border border-[#E5E5E4] bg-white text-[#4B3621] focus:outline-none focus:ring-2 focus:ring-[#CC5500] transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234B3621%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[position:right_0.75rem_center] bg-no-repeat pr-10"
                >
                    <option value="">All Universities</option>
                    {universities.map((uni) => (
                        <option key={uni.id} value={uni.id}>
                            {uni.name}
                        </option>
                    ))}
                </select>

                <div className="flex h-11 rounded-xl border border-[#E5E5E4] overflow-hidden bg-white sm:flex-none">
                    <button
                        onClick={() => setSortBy('recent')}
                        className={`flex-1 sm:flex-none px-4 sm:px-6 h-full flex items-center justify-center text-sm font-medium transition-colors ${sortBy === 'recent'
                            ? 'bg-[#CC5500] text-white'
                            : 'text-[#4B3621] hover:bg-[#F5F5F4]'
                            }`}
                    >
                        Recently Added
                    </button>
                    <button
                        onClick={() => setSortBy('happening')}
                        className={`flex-1 sm:flex-none px-4 sm:px-6 h-full flex items-center justify-center text-sm font-medium transition-colors border-l border-[#E5E5E4] ${sortBy === 'happening'
                            ? 'bg-[#CC5500] text-white'
                            : 'text-[#4B3621] hover:bg-[#F5F5F4]'
                            }`}
                    >
                        Happening Soon
                    </button>
                </div>
            </div>

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
                <div className="space-y-6 flex flex-col items-center w-full px-2 md:px-0">
                    {events.map((event) => (
                        <Card key={event.id} hover className='max-w-full lg:max-w-[40vw] w-full'>
                            <CardContent className="p-0 lg:p-6">
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
                                        <p className="text-sm text-gray-500">
                                            {formatDate(event.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Event Content */}
                                <h2 className="text-xl md:text-2xl font-bold text-[#4B3621] mb-3 break-words">{event.title}</h2>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4 text-sm md:text-base">{event.content}</p>

                                {/* Event Image */}
                                {event.imagePath && (
                                    <div className="mb-4 overflow-hidden flex items-center justify-center rounded-lg">
                                        <Image
                                            src={event.imagePath}
                                            alt={event.title}
                                            className="w-full h-auto max-h-[50vh] lg:max-w-[50vw] lg:max-h-[70vh] object-contain"
                                            width={1080}
                                            height={1920}
                                        />
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="mt-4 pt-4 border-t border-[#F5F5F4] flex items-center">
                                    <button
                                        onClick={() => handleLike(event.id)}
                                        className="flex items-center space-x-2 group transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                                        title={currentUserId ? (event.isLikedByUser ? 'Unlike' : 'Like') : 'Sign in to like'}
                                    >
                                        <svg
                                            className={`w-6 h-6 transition-colors duration-200 ${event.isLikedByUser
                                                ? 'text-red-500 fill-red-500'
                                                : 'text-gray-400 fill-none group-hover:text-red-400'
                                                }`}
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                        <span className={`text-sm font-medium ${event.isLikedByUser ? 'text-red-500' : 'text-gray-500'
                                            }`}>
                                            {event.likeCount > 0 ? event.likeCount : ''}
                                        </span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
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
            {!hasMore && events.length > 0 && !isFiltering && (
                <div className="text-center py-8">
                    <p className="text-sm text-gray-500">You&apos;ve reached the end! 🎉</p>
                </div>
            )}
        </>
    )
}
