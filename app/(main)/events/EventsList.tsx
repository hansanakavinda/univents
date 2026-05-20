'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { EventCard, Card, CardContent } from '@/components/ui/Card'
import { Dropdown } from '@/components/ui/Dropdown'
import { Badge } from '@/components/ui/Badge'
import { LikeButton } from '@/components/ui/LikeButton'
import { ShareButton } from '@/components/ui/ShareButton'
import { LinkifyText } from '@/components/ui/LinkifyText'
import Image from 'next/image'
import type { Event } from '@/types/event'
import { formatDate, formatTime, formatDateToLong } from '@/lib/utils'
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
                <div className="mb-6 p-4 md:p-0 flex flex-col lg:flex-row items-stretch items-center justify-center gap-3">
                    <Dropdown
                        value={selectedUniId}
                        onChange={setSelectedUniId}
                        options={universities.map(uni => ({ label: uni.name, value: uni.id }))}
                        placeholder="All Universities"
                        className="w-full lg:w-auto min-w-[200px] z-20"
                    />

                    <div className="grid grid-cols-2 h-11 rounded-xl border border-border overflow-hidden bg-surface lg:flex-none">
                        <button
                            onClick={() => setSortBy('recent')}
                            className={`px-4 lg:px-6 h-full flex items-center justify-center text-sm font-medium transition-colors ${sortBy === 'recent'
                                ? 'bg-primary text-white'
                                : 'text-text-primary hover:bg-surface-hover'
                                }`}
                        >
                            All Univents
                        </button>
                        <button
                            onClick={() => setSortBy('happening')}
                            className={`px-4 lg:px-6 h-full flex items-center justify-center text-sm font-medium transition-colors border-l border-border ${sortBy === 'happening'
                                ? 'bg-primary text-white'
                                : 'text-text-primary hover:bg-surface-hover'
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
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm text-text-muted">Loading events...</p>
                </div>
            )}

            {/* Empty state */}
            {!isFiltering && events.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
                            <svg className="w-8 h-8 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {selectedUniId || sortBy !== 'recent' ? 'No events match your filters' : 'No events yet'}
                        </h3>
                        <p className="text-text-muted">
                            {selectedUniId || sortBy !== 'recent'
                                ? 'Try adjusting your filters to see more events.'
                                : 'Be the first to share an event with the community!'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Events List */}
            {!isFiltering && events.length > 0 && (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 w-full">
                    {events.map((event, index) => (
                        <div key={event.id} className="break-inside-avoid mb-6">
                            <EventCard hover className="w-full flex flex-col relative overflow-hidden">
                                {/* SEO: <article> identifies each event as a self-contained piece of content */}
                                <article className="flex flex-col h-full">
                                    <CardContent className="p-0 flex flex-col h-full">
                                        {/* Event Image (Top) */}
                                        {event.imagePath && (
                                            <Link href={`/events/${event.id}`}>
                                                <div className="w-full overflow-hidden bg-black/10 shrink-0">
                                                    <Image
                                                        src={event.imagePath}
                                                        alt={`${event.title} at ${event.university.name}`}
                                                        className="w-full object-cover max-h-[400px] hover:scale-105 transition-transform duration-500"
                                                        width={800}
                                                        height={800}
                                                        priority={index < 4}
                                                    />
                                                </div>
                                            </Link>
                                        )}

                                        <div className="p-4 md:p-5 flex flex-col grow">
                                            <Link href={`/events/${event.id}`}>
                                                <div className="mb-2">
                                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                        <Badge variant="default">{event.university.shortName}</Badge>
                                                        <span className="flex items-center gap-1 text-xs text-text-muted">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {event.author.name || 'Anonymous'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-3">
                                                        {event.title}
                                                    </h3>
                                                </div>

                                                {/* Meta Badges */}
                                                <div className="bg-accent/10 backdrop-blur-sm px-2.5 py-2 rounded-lg border border-accent/20 flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-4 shadow-sm w-full">
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {event.isComingSoon || !event.endDate ? (
                                                            <span className="text-accent text-xs font-semibold tracking-wide">Coming Soon</span>
                                                        ) : (
                                                            <time dateTime={new Date(event.endDate).toISOString()} className="text-white text-xs font-semibold">{formatDateToLong(event.endDate)}</time>
                                                        )}
                                                    </div>
                                                    {event.eventTime && (
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="text-white text-xs font-semibold">{formatTime(event.eventTime)}</span>
                                                        </div>
                                                    )}
                                                    {event.venue && (
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span className="text-white text-xs font-semibold line-clamp-1 break-words">{event.venue}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>

                                            <div className={`text-text-primary whitespace-pre-wrap leading-relaxed mb-1 text-sm ${!expandedEvents.has(event.id) ? (event.imagePath ? 'line-clamp-3' : 'line-clamp-[12]') : ''}`}>
                                                <LinkifyText>{event.content}</LinkifyText>
                                            </div>

                                            {event.content.split('\n').length > (event.imagePath ? 3 : 12) || event.content.length > (event.imagePath ? 150 : 500) ? (
                                                <button
                                                    onClick={() => toggleExpand(event.id)}
                                                    className="text-accent text-xs font-medium hover:underline mb-2 mt-1 cursor-pointer"
                                                >
                                                    {expandedEvents.has(event.id) ? 'See less' : 'See more'}
                                                </button>
                                            ) : <div className="mb-2" />}
                                        </div>

                                        {/* Footer */}
                                        <div className="pt-3 pb-4 px-5 border-t border-border flex items-center justify-between mt-auto">
                                            <LikeButton
                                                eventId={event.id}
                                                initialLikeCount={event.likeCount}
                                                initialIsLiked={event.isLikedByUser}
                                                currentUserId={currentUserId}
                                            />
                                            <ShareButton eventId={event.id} title={event.title} />
                                        </div>
                                    </CardContent>
                                </article>
                            </EventCard>
                        </div>
                    ))}
                </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm text-text-muted">Loading more events...</p>
                </div>
            )}

            {/* End of Events */}
            {!hasMore && events.length > 0 && !isFiltering && isAuthenticated && (
                <div className="text-center py-8">
                    <p className="text-sm text-text-dim">You&apos;ve reached the end! 🎉</p>
                </div>
            )}

            {/* Sign-in CTA for unauthenticated users */}
            {!isAuthenticated && events.length > 0 && (
                <div className="text-center py-10">
                    <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-surface to-card border border-border">
                        <p className="text-white font-semibold mb-2">Want to see more events?</p>
                        <p className="text-sm text-text-muted mb-4">Sign in to browse all events and create your own.</p>
                        <a
                            href="/login"
                            className="inline-flex items-center px-6 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors"
                        >
                            Sign in to continue
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}
