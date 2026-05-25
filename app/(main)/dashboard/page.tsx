import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { getUserEvents, getUserEventStats } from '@/data-access/events'
import { getUserGigs, getUserGigStats } from '@/data-access/gigs'
import { getUserProducts, getUserProductStats } from '@/data-access/products'
import { DashboardTabs } from '@/components/user/DashboardTabs'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const userId = session.user.id!

  // Direct data-access queries on server
  const userEvents = await getUserEvents(userId, { take: 5 })
  const eventStats = await getUserEventStats(userId)

  const userGigs = await getUserGigs(userId, { take: 5 })
  const gigStats = await getUserGigStats(userId)

  const userProducts = await getUserProducts(userId, { take: 5 })
  const productStats = await getUserProductStats(userId)

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-text-muted">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>
        <div className="md:mt-0 mt-2 self-start md:self-center">
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
      </div>

      <DashboardTabs
        userEvents={JSON.parse(JSON.stringify(userEvents))}
        totalEvents={eventStats.totalEvents}
        approvedEvents={eventStats.approvedEvents}
        pendingEvents={eventStats.pendingEvents}
        userGigs={JSON.parse(JSON.stringify(userGigs))}
        totalGigs={gigStats.totalGigs}
        approvedGigs={gigStats.approvedGigs}
        pendingGigs={gigStats.pendingGigs}
        userProducts={JSON.parse(JSON.stringify(userProducts))}
        totalProducts={productStats.totalProducts}
        approvedProducts={productStats.approvedProducts}
        pendingProducts={productStats.pendingProducts}
      />
    </div>
  )
}
