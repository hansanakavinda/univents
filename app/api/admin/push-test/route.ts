import { NextResponse } from 'next/server'
import { requireFreshAuth } from '@/lib/api/auth-checks'
import { prisma } from '@/lib/prisma'
import { sendPushNotification } from '@/lib/webpush'

export const GET = async () => {
  try {
    // 1. Verify user is admin/superadmin
    const { freshUser } = await requireFreshAuth({ roles: ['ADMIN', 'SUPER_ADMIN'] })

    // 2. Get all admin users
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
        isActive: true,
      },
      select: { id: true, email: true, role: true },
    })

    const adminIds = admins.map(a => a.id)

    // 3. Get all push subscriptions
    const allSubscriptions = await prisma.pushSubscription.findMany({
      select: {
        id: true,
        endpoint: true,
        userId: true,
        createdAt: true,
      }
    })

    // Mask endpoints for security
    const subscriptionsWithStatus = allSubscriptions.map(sub => {
      const isLinkedToAdmin = sub.userId ? adminIds.includes(sub.userId) : false
      const matchedAdmin = admins.find(a => a.id === sub.userId)
      return {
        id: sub.id,
        endpointMasked: sub.endpoint.substring(0, 40) + '...',
        userId: sub.userId,
        isLinkedToAdmin,
        adminEmail: matchedAdmin?.email || null,
        createdAt: sub.createdAt,
      }
    })

    return NextResponse.json({
      currentUser: freshUser,
      allAdminsInSystem: admins,
      totalSubscriptionsInDB: allSubscriptions.length,
      subscriptions: subscriptionsWithStatus,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: err.status || 500 })
  }
}

export const POST = async () => {
  try {
    // 1. Verify user is admin/superadmin
    const { freshUser } = await requireFreshAuth({ roles: ['ADMIN', 'SUPER_ADMIN'] })

    // 2. Find subscriptions for this specific admin
    const mySubscriptions = await prisma.pushSubscription.findMany({
      where: { userId: freshUser.id },
    })

    if (mySubscriptions.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No push subscriptions found for your current user ID. Please enable alerts on this device.' 
      })
    }

    const results = []
    for (const sub of mySubscriptions) {
      const res = await sendPushNotification(sub, {
        title: 'Test Admin Notification 🔔',
        body: 'Push setup is fully verified and working!',
        url: '/admin/moderation',
        icon: '/icon.png',
      })
      results.push({
        endpointMasked: sub.endpoint.substring(0, 40) + '...',
        success: res.ok,
        gone: res.gone,
      })
    }

    return NextResponse.json({
      success: true,
      message: `Sent test notification to ${mySubscriptions.length} device(s).`,
      results,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: err.status || 500 })
  }
}
