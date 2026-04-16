'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { EventEditor, type EventData } from '@/app/events/EventEditor'

interface University {
    id: string
    name: string
    shortName: string
}

interface UserEvent {
    id: string
    title: string
    content: string
    imagePath: string | null
    endDate: Date | string
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
    universities: University[]
}

export function RecentEvents({ events, universities }: RecentEventsProps) {
    const [editingEvent, setEditingEvent] = useState<EventData | null>(null)

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
        <>
            <div className="space-y-4">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="flex items-start justify-between p-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors gap-3"
                    >
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                            <p className="text-sm text-text-muted line-clamp-2">{event.content}</p>
                            <div className="flex items-center space-x-2 text-xs text-text-dim mt-2">
                                <span>
                                    📅 {new Date(event.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() =>
                                    setEditingEvent({
                                        id: event.id,
                                        title: event.title,
                                        content: event.content,
                                        imagePath: event.imagePath,
                                        endDate: event.endDate,
                                        uniId: event.uniId,
                                    })
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-accent border border-accent/40 bg-accent/10 hover:bg-accent/20 hover:border-accent/60 transition-all duration-200"
                                title="Edit event"
                                aria-label={`Edit ${event.title}`}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Edit
                            </button>
                            <Badge variant={event.isApproved ? 'success' : 'warning'} className="py-1.5">
                                {event.isApproved ? 'Approved' : 'Pending'}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            {/* Shared edit modal — only one at a time */}
            {editingEvent && (
                <EventEditor
                    universities={universities}
                    eventData={editingEvent}
                    defaultOpen={true}
                    onOpenChange={(open) => {
                        if (!open) setEditingEvent(null)
                    }}
                    trigger={<></>}
                />
            )}
        </>
    )
}
