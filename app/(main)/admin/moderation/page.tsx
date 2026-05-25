import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getPendingEvents, getRecentApprovedEvents, getEventStats } from '@/data-access/events'
import { getPendingGigs, getRecentApprovedGigs, getGigStats } from '@/data-access/gigs'
import { getPendingProducts, getRecentApprovedProducts, getProductStats } from '@/data-access/products'
import { ModerationTabs } from './ModerationTabs'

export default async function AdminModerationPage() {
    const session = await getSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
        redirect('/dashboard')
    }

    // For ADMIN users, look up their university to filter moderation content
    let uniId: string | undefined
    if (session.user.role === 'ADMIN') {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { uniId: true },
        })
        uniId = user?.uniId ?? undefined
    }

    const pendingEvents = await getPendingEvents({ uniId })
    const recentApprovedEvents = await getRecentApprovedEvents({ uniId })
    const eventStats = await getEventStats({ uniId })

    const pendingGigs = await getPendingGigs({ uniId })
    const recentApprovedGigs = await getRecentApprovedGigs({ uniId })
    const gigStats = await getGigStats({ uniId })

    const pendingProducts = await getPendingProducts({ uniId })
    const recentApprovedProducts = await getRecentApprovedProducts({ uniId })
    const productStats = await getProductStats({ uniId })

    return (
        <div className="p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Content Moderation</h1>
                <p className="text-text-muted">Review and approve pending events, gigs, and shop items</p>
            </header>

            <ModerationTabs
                pendingEvents={JSON.parse(JSON.stringify(pendingEvents))}
                recentApprovedEvents={JSON.parse(JSON.stringify(recentApprovedEvents))}
                eventStats={eventStats}
                pendingGigs={JSON.parse(JSON.stringify(pendingGigs))}
                recentApprovedGigs={JSON.parse(JSON.stringify(recentApprovedGigs))}
                gigStats={gigStats}
                pendingProducts={JSON.parse(JSON.stringify(pendingProducts))}
                recentApprovedProducts={JSON.parse(JSON.stringify(recentApprovedProducts))}
                productStats={productStats}
            />
        </div>
    )
}
