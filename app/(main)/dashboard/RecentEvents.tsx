'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { LinkifyText } from '@/components/ui/LinkifyText'
import { Calendar, MapPin, Clock, Edit3 } from 'lucide-react'

interface UserEvent {
    id: string
    title: string
    content: string
    imagePath: string | null
    endDate: Date | string | null
    isComingSoon: boolean
    eventTime?: string | null
    venue?: string | null
    uniId: string
    isApproved: boolean
    createdAt: Date | string
    university: {
        name: string
        shortName: string
    }
}

interface RecentEventsProps {
    events: UserEvent[]
}

export function RecentEvents({ events }: RecentEventsProps) {
    if (events.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-text-muted mb-4">You haven&apos;t created any events yet.</p>
                <a
                    href="/events?create=true"
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                    Create Your First Event
                </a>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {events.map((event) => (
                <div
                    key={event.id}
                    className="relative flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(124,58,237,0.06)] hover:scale-[1.005] transition-all duration-300"
                >
                    {/* Status Dot */}
                    <div
                        className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${
                            event.isApproved
                                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                                : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]'
                        }`}
                        title={event.isApproved ? 'Approved' : 'Pending Approval'}
                    />

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 mb-3 pr-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="font-semibold text-white text-sm leading-snug tracking-tight">
                                {event.title}
                            </h4>
                            {event.university && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-accent border border-primary/20 uppercase tracking-wider shrink-0">
                                    🏫 {event.university.shortName}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-dim">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                                <span>
                                    Created {new Date(event.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </span>
                            {event.venue && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-accent/70 shrink-0" />
                                    <span className="truncate max-w-[200px]" title={event.venue}>
                                        {event.venue}
                                    </span>
                                </span>
                            )}
                            {event.eventTime && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-accent/70 shrink-0" />
                                    <span>{event.eventTime}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/30">
                        <Link
                            href={`/events/${event.id}/edit`}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-accent border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:border-accent/40 transition-all duration-200 cursor-pointer shrink-0"
                            title="Edit event"
                            aria-label={`Edit ${event.title}`}
                        >
                            <Edit3 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-accent/80 group-hover:text-accent" />
                            <span className="hidden sm:inline ml-1">Edit</span>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}
