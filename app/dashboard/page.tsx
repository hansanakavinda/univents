import { auth } from '@/lib/auth'
import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch user stats
  const userEvents = await prisma.event.findMany({
    where: { authorId: session.user.id },
    include: {
      university: {
        select: {
          name: true,
          shortName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const totalEvents = await prisma.event.count({
    where: { authorId: session.user.id },
  })

  const approvedEvents = await prisma.event.count({
    where: {
      authorId: session.user.id,
      isApproved: true,
    },
  })

  const pendingEvents = await prisma.event.count({
    where: {
      authorId: session.user.id,
      isApproved: false,
    },
  })

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
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-[#9ca3af]">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>

        {/* Role Badge */}
        <div className="mb-6">
          <Badge
            variant={
              session.user.role === 'SUPER_ADMIN'
                ? 'danger'
                : session.user.role === 'ADMIN'
                  ? 'info'
                  : 'default'
            }
          >
            {session.user.role.replace('_', ' ')}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="text-4xl text-[#a78bfa]">{totalEvents}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#9ca3af]">All your submitted events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-4xl text-green-400">{approvedEvents}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#9ca3af]">Visible to the public</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Pending Approval</CardDescription>
              <CardTitle className="text-4xl text-yellow-400">{pendingEvents}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#9ca3af]">Awaiting moderation</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Your Recent Events</CardTitle>
            <CardDescription>Your latest submissions and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {userEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#9ca3af] mb-4">You haven&apos;t created any events yet.</p>
                <a
                  href="/events?create=true"
                  className="inline-flex items-center px-4 py-2 rounded-xl bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"
                >
                  Create Your First Event
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {userEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between p-4 rounded-xl bg-[#1a1a2e] hover:bg-[#25253d] transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                      <p className="text-sm text-[#9ca3af] line-clamp-2">{event.content}</p>
                      <div className="flex items-center space-x-2 text-xs text-[#6b6b7b] mt-2">
                        <span>
                          📅 {new Date(event.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <Badge variant={event.isApproved ? 'success' : 'warning'}>
                      {event.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
