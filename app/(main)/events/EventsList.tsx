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
    const [hasMore, setHasMore] = useState(isAuthenticated && initialEvents.length >= 6)
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
            take: '6',
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
                setHasMore(data.events.length >= 6)
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
                <div className="mb-8 mt-2 flex justify-center sticky top-[88px] z-30 px-4 md:px-0">
                    <div className="flex flex-col sm:flex-row items-center gap-1.5 p-1.5 rounded-[1.25rem] sm:rounded-full bg-surface/70 backdrop-blur-xl border border-white/10 shadow-xl w-full sm:w-auto max-w-2xl">
                        <div className="w-full sm:w-auto min-w-[200px] relative z-20">
                            <Dropdown
                                value={selectedUniId}
                                onChange={setSelectedUniId}
                                options={universities.map(uni => ({ label: uni.name, value: uni.id }))}
                                placeholder="All Universities"
                                className="w-full [&>button]:!bg-transparent [&>button]:!border-0 [&>button]:!shadow-none [&>button]:!ring-0 hover:[&>button]:!bg-white/5 [&>button]:!rounded-full [&>button]:transition-colors"
                            />
                        </div>

                        <div className="hidden sm:block w-px h-6 bg-white/10 mx-1"></div>
                        <div className="block sm:hidden w-full h-px bg-white/10 my-1"></div>

                        <div className="flex gap-1 p-1 w-full sm:w-auto rounded-xl sm:rounded-full bg-black/30 relative border border-white/5 shadow-inner">
                            <button
                                onClick={() => setSortBy('recent')}
                                className={`relative flex-1 sm:flex-none px-6 py-2 rounded-lg sm:rounded-full text-sm font-medium transition-all duration-300 z-10 ${sortBy === 'recent'
                                    ? 'bg-surface text-primary shadow-md ring-1 ring-white/10'
                                    : 'text-text-muted hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                All Univents
                            </button>
                            <button
                                onClick={() => setSortBy('happening')}
                                className={`relative flex-1 sm:flex-none px-6 py-2 rounded-lg sm:rounded-full text-sm font-medium transition-all duration-300 z-10 ${sortBy === 'happening'
                                    ? 'bg-surface text-primary shadow-md ring-1 ring-white/10'
                                    : 'text-text-muted hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Happening Soon
                            </button>
                        </div>
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
                <Card className=''>
                    <CardContent className="text-center py-12 ">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
                            <svg className="w-8 h-8 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {selectedUniId || sortBy !== 'recent' ? 'No events match your filters' : 'Oops no events found :('}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start">
                    {events.map((event, index) => (
                        <div key={event.id} className="w-full">
                            <EventCard hover className={`w-full flex flex-col relative overflow-hidden transition-all duration-300 ${expandedEvents.has(event.id) ? 'h-auto' : 'h-[750px]'}`}>
                                {/* SEO: <article> identifies each event as a self-contained piece of content */}
                                <article className="flex flex-col h-full">
                                    <CardContent className="p-0 flex flex-col h-full">
                                        {/* Event Image (Top) */}
                                        {event.imagePath && (
                                            <Link href={`/events/${event.id}`}>
                                                <div className="w-full max-h-[400px] overflow-hidden shrink-0 relative group bg-surface border-b border-border/50 flex items-center justify-center">
                                                    <Image
                                                        src={event.imagePath}
                                                        alt={`${event.title} at ${event.university.name}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                                            <div className={`text-text-primary whitespace-pre-wrap leading-relaxed mb-1 text-sm ${!expandedEvents.has(event.id) ? (event.imagePath ? 'line-clamp-3' : 'line-clamp-[22]') : ''}`}>
                                                <LinkifyText>{event.content}</LinkifyText>
                                            </div>

                                            {event.content.split('\n').length > (event.imagePath ? 3 : 22) || event.content.length > (event.imagePath ? 150 : 1000) ? (
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

                    {/* Filler / Ghost Cards for sparse grids */}
                    {events.length < 3 && Array.from({ length: 3 - events.length }).map((_, i) => (
                        <div key={`ghost-${i}`} className="w-full h-full min-h-[750px]">
                            <Link href="/events/create" className="block h-full group">
                                <div className="h-full rounded-2xl border-2 border-dashed border-white/10 bg-surface/30 hover:bg-surface/50 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center transition-all duration-500 hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 ring-1 ring-primary/20 group-hover:ring-primary/40">
                                        <svg className="w-8 h-8 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 relative z-10 transition-colors group-hover:text-primary-hover">Got an Event?</h3>
                                    <p className="text-text-muted text-sm max-w-[200px] relative z-10">
                                        Share your campus activity, hackathon, or workshop with the community.
                                    </p>
                                </div>
                            </Link>
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
                <div className="text-center py-12 w-full">
                    <div className="p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-primary/10 via-surface to-brand/10 border border-border/50 backdrop-blur-md max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">Unlock All Events</h3>
                            <p className="text-base md:text-lg text-text-muted mb-8 max-w-lg mx-auto">Sign in to discover, filter, and save all upcoming university events across Sri Lanka. Join the community today!</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-white font-medium text-base hover:bg-primary-hover transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-surface hover:bg-surface-hover text-white font-medium text-base border border-border transition-all hover:-translate-y-0.5"
                                >
                                    Create Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
