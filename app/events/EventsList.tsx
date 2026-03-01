'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

type Event = {
    id: string
    title: string
    content: string
    imagePath: string
    location: string
    startDate: Date | string
    endDate: Date | string
    otherInfo: string | null
    isApproved: boolean
    createdAt: Date | string
    author: {
        name: string | null
        email: string
        role: string
    }
    university: {
        name: string
        shortName: string
    }
}

interface EventsListProps {
    initialEvents: Event[]
}

export function EventsList({ initialEvents }: EventsListProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(initialEvents.length >= 4)
    const [lastScrollY, setLastScrollY] = useState(0)
    const loadingRef = useRef(false)

    const fetchMoreEvents = async () => {
        if (loadingRef.current || !hasMore) return

        loadingRef.current = true
        setIsLoading(true)

        try {
            const response = await fetch(`/api/events/list?take=4&skip=${events.length}`)
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

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
    }

    if (events.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F5F4] flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#4B3621] mb-2">No events yet</h3>
                    <p className="text-gray-600">Be the first to share an event with the community!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <div className="space-y-6">
                {events.map((event) => (
                    <Card key={event.id} hover>
                        <CardContent className="p-6">
                            {/* Event Image */}
                            {event.imagePath && (
                                <div className="mb-4 rounded-xl overflow-hidden h-48">
                                    <img
                                        src={event.imagePath}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Author Info */}
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CC5500] to-[#2D5A27] flex items-center justify-center text-white font-semibold text-lg">
                                    {event.author.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <p className="font-semibold text-[#4B3621]">{event.author.name || 'Anonymous'}</p>
                                        <Badge variant="default" className="text-xs">
                                            {event.university.shortName}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(event.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Event Content */}
                            <h2 className="text-2xl font-bold text-[#4B3621] mb-3">{event.title}</h2>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">{event.content}</p>

                            {/* Event Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-4 rounded-xl bg-[#F5F5F4]">
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <svg className="w-4 h-4 text-[#CC5500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <svg className="w-4 h-4 text-[#2D5A27]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{formatDate(event.startDate)} — {formatDate(event.endDate)}</span>
                                </div>
                            </div>

                            {event.otherInfo && (
                                <p className="text-sm text-gray-600 italic mb-4">{event.otherInfo}</p>
                            )}

                            {/* Footer */}
                            <div className="mt-4 pt-4 border-t border-[#F5F5F4] flex items-center justify-between">
                                <Badge variant="success">✓ Approved</Badge>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>Public</span>
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-[#CC5500] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading more events...</p>
                </div>
            )}

            {/* End of Events */}
            {!hasMore && events.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-sm text-gray-500">You&apos;ve reached the end! 🎉</p>
                </div>
            )}
        </>
    )
}
