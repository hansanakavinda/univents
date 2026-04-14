import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { prisma } from '@/lib/prisma'
import { EventModerationActions } from './EventModerationActions'
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
                    <p className="text-[#9ca3af]">Review and approve pending events</p>
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
                            <CardTitle className="text-4xl text-[#a78bfa]">{stats.total}</CardTitle>
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
                                <p className="text-[#6b6b7b]">No events pending approval</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-6 rounded-xl bg-[#1a1a2e] border-l-4 border-yellow-500"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center flex-wrap gap-2 text-sm text-[#9ca3af] mb-3">
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

                                                <p className="text-[#c4c4cc] whitespace-pre-wrap">{event.content}</p>
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
                <Card>
                    <CardHeader>
                        <CardTitle>Recently Approved</CardTitle>
                        <CardDescription>Latest approved events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentApproved.map((event) => (
                                <div
                                    key={event.id}
                                    className="p-4 rounded-xl bg-[#1a1a2e] border-l-4 border-green-500"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-white mb-1 break-words">{event.title}</h4>
                                            <p className="text-sm text-[#9ca3af] line-clamp-2 mb-2">{event.content}</p>
                                            <div className="flex items-center flex-wrap gap-2 text-xs text-[#6b6b7b]">
                                                <span className="whitespace-nowrap">{event.author.name}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">{event.university.shortName}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">{new Date(event.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="self-start sm:self-auto shrink-0 mt-2 sm:mt-0">
                                            <Badge variant="success">Approved</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
