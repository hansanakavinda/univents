import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { moderateEventSchema } from '@/lib/validators/admin-events'
import { moderateEvent } from '@/data-access/events'
import { sendPushToAll } from '@/lib/webpush'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    // SECURITY: Uses fresh DB check — not cached JWT — for moderation actions
    await requireFreshAuth({ roles: ['ADMIN', 'SUPER_ADMIN'] })

    const { eventId, action } = await validateRequest(request, moderateEventSchema)

    const result = await moderateEvent({ eventId, action })

    // Fire push notifications when an event is approved (fire-and-forget)
    if (action === 'approve' && result.event) {
        const baseUrl = process.env.NEXTAUTH_URL || 'https://univents.com.lk'
        const eventUrl = `${baseUrl}/events/${result.event.id}`

        sendPushToAll({
            title: '🎉 New Event on Univents!',
            body: result.event.title,
            url: eventUrl,
            icon: '/icon.png',
        }).catch((err) =>
            console.error('[moderate] Push notification error:', err)
        )
    }

    return NextResponse.json({ success: result.success })
}, 'Moderation')
