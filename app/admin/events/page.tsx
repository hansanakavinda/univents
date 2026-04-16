import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { prisma } from '@/lib/prisma'
import { EventModerationActions } from './EventModerationActions'
import { RecentlyApprovedEvents } from './RecentlyApprovedEvents'
import { getPendingEvents, getRecentApprovedEvents, getEventStats } from '@/data-access/events'

export default async function AdminEventsPage() {
    const session = await getSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        redirect('/dashboard')
    }

    // For ADMIN users, look up their university to filter events
    let uniId: string | undefined
    if (session.user.role === 'ADMIN') {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { uniId: true },
        })
        uniId = user?.uniId ?? undefined
    }

    const pendingEvents = await getPendingEvents({ uniId })
    const recentApproved = await getRecentApprovedEvents({ uniId })
    const stats = await getEventStats({ uniId })

    return (
        <div className="flex min-h-screen">
            <Sidebar
                userRole={session.user.role}
                userName={session.user.name || 'User'}
                userEmail={session.user.email || ''}
            />

            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-full overflow-hidden">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Event Moderation</h1>
                    <p className="text-text-muted">Review and approve pending events</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardDescription>Pending Review</CardDescription>
                            <CardTitle className="text-4xl text-yellow-400">{stats.pending}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Approved</CardDescription>
                            <CardTitle className="text-4xl text-green-400">{stats.approved}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Events</CardDescription>
                            <CardTitle className="text-4xl text-accent">{stats.total}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Pending Events */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Pending Approval</CardTitle>
                        <CardDescription>Events awaiting moderation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pendingEvents.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-text-dim">No events pending approval</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-6 rounded-xl bg-surface border-l-4 border-yellow-500"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center flex-wrap gap-2 text-sm text-text-muted mb-3">
                                                    <span className="whitespace-nowrap">By {event.author.name || 'Unknown'}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="whitespace-nowrap">{event.author.email}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <Badge variant="default" className="whitespace-nowrap">{event.university.shortName}</Badge>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="whitespace-nowrap">
                                                        {new Date(event.createdAt).toLocaleString('en-US', {
                                                            dateStyle: 'medium',
                                                            timeStyle: 'short',
                                                        })}
                                                    </span>
                                                </div>

                                                <p className="text-text-primary whitespace-pre-wrap">{event.content}</p>
                                            </div>
                                        </div>
                                        <EventModerationActions eventId={event.id} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recently Approved */}
                <RecentlyApprovedEvents events={recentApproved} />
            </main>
        </div>
    )
}
