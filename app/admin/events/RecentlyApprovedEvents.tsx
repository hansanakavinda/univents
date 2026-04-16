'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { ApiClient } from '@/lib/api/api-client'

interface ApprovedEvent {
    id: string
    title: string
    content: string
    updatedAt: string | Date
    author: {
        name: string | null
        email: string
    }
    university: {
        name: string
        shortName: string
    }
}

interface RecentlyApprovedEventsProps {
    events: ApprovedEvent[]
}

export function RecentlyApprovedEvents({ events }: RecentlyApprovedEventsProps) {
    const router = useRouter()
    const toast = useToast()
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const pendingEvent = events.find((e) => e.id === pendingDeleteId)

    const handleDeleteConfirm = async () => {
        if (!pendingDeleteId) return

        setIsDeleting(true)
        try {
            const result = await ApiClient.post('/api/admin/events/delete', {
                eventId: pendingDeleteId,
            })

            if (result.ok) {
                router.refresh()
                toast.success('Event deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete event')
            }
        } finally {
            setIsDeleting(false)
            setPendingDeleteId(null)
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Recently Approved</CardTitle>
                    <CardDescription>Latest approved events</CardDescription>
                </CardHeader>
                <CardContent>
                    {events.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-text-dim">No approved events yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="p-4 rounded-xl bg-surface border-l-4 border-green-500"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-white mb-1 break-words">{event.title}</h4>
                                            <p className="text-sm text-text-muted line-clamp-2 mb-2">{event.content}</p>
                                            <div className="flex items-center flex-wrap gap-2 text-xs text-text-dim">
                                                <span className="whitespace-nowrap">{event.author.name}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">{event.university.shortName}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">{new Date(event.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 mt-2 sm:mt-0">
                                            <Badge variant="success">Approved</Badge>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => setPendingDeleteId(event.id)}
                                                disabled={isDeleting}
                                            >
                                                ✕ Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmDialog
                isOpen={!!pendingDeleteId}
                onClose={() => setPendingDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Event"
                description={
                    pendingEvent
                        ? `Are you sure you want to permanently delete "${pendingEvent.title}"? This action cannot be undone.`
                        : 'Are you sure you want to permanently delete this event? This action cannot be undone.'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    )
}

