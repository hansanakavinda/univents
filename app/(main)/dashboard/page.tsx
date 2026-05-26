import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { getUserEvents, getUserEventStats } from '@/data-access/events'
import { getUserGigs, getUserGigStats } from '@/data-access/gigs'
import { getUserProducts, getUserProductStats } from '@/data-access/products'
import { getUserHustles, getUserHustleStats } from '@/data-access/hustles'
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

  const userHustles = await getUserHustles(userId, { take: 5 })
  const hustleStats = await getUserHustleStats(userId)

  return (
    <div className="p-4 md:p-8">
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
        userHustles={JSON.parse(JSON.stringify(userHustles))}
        totalHustles={hustleStats.totalHustles}
        approvedHustles={hustleStats.approvedHustles}
        pendingHustles={hustleStats.pendingHustles}
      />
    </div>
  )
}
