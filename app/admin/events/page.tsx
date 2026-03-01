import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { prisma } from '@/lib/prisma'
import { EventModerationActions } from './EventModerationActions'

export default async function AdminEventsPage() {
    const session = await getSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        redirect('/dashboard')
    }

    // Fetch pending and all events
    const pendingEvents = await prisma.event.findMany({
        where: { isApproved: false },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    role: true,
                },
            },
            university: {
                select: {
                    name: true,
                    shortName: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    const recentApproved = await prisma.event.findMany({
        where: { isApproved: true },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                },
            },
            university: {
                select: {
                    name: true,
                    shortName: true,
                },
            },
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
    })

    const stats = {
        pending: await prisma.event.count({ where: { isApproved: false } }),
        approved: await prisma.event.count({ where: { isApproved: true } }),
        total: await prisma.event.count(),
    }

    return (
        <div className="flex min-h-screen bg-[#FCFAF7]">
            <Sidebar
                userRole={session.user.role}
                userName={session.user.name || 'User'}
                userEmail={session.user.email || ''}
            />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#4B3621] mb-2">Event Moderation</h1>
                    <p className="text-gray-600">Review and approve pending events</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardDescription>Pending Review</CardDescription>
                            <CardTitle className="text-4xl text-yellow-600">{stats.pending}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Approved</CardDescription>
                            <CardTitle className="text-4xl text-[#2D5A27]">{stats.approved}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Events</CardDescription>
                            <CardTitle className="text-4xl text-[#CC5500]">{stats.total}</CardTitle>
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
                                <p className="text-gray-500">No events pending approval</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-6 rounded-xl bg-[#F5F5F4] border-l-4 border-yellow-500"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-[#4B3621] mb-2">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
                                                    <span>By {event.author.name || 'Unknown'}</span>
                                                    <span>•</span>
                                                    <span>{event.author.email}</span>
                                                    <span>•</span>
                                                    <Badge variant="default">{event.university.shortName}</Badge>
                                                    <span>•</span>
                                                    <span>
                                                        {new Date(event.createdAt).toLocaleString('en-US', {
                                                            dateStyle: 'medium',
                                                            timeStyle: 'short',
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                    <span>📍 {event.location}</span>
                                                    <span>📅 {new Date(event.startDate).toLocaleDateString()} — {new Date(event.endDate).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-700 whitespace-pre-wrap">{event.content}</p>
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
                                    className="p-4 rounded-xl bg-[#F5F5F4] border-l-4 border-[#2D5A27]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[#4B3621] mb-1">{event.title}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.content}</p>
                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                <span>{event.author.name}</span>
                                                <span>•</span>
                                                <span>{event.university.shortName}</span>
                                                <span>•</span>
                                                <span>{new Date(event.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <Badge variant="success">Approved</Badge>
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
