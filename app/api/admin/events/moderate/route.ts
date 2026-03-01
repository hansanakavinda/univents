import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { moderateEventSchema } from '@/lib/validators/admin-events'
import { moderateEvent } from '@/data-access/events'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    // SECURITY: Uses fresh DB check — not cached JWT — for moderation actions
    await requireFreshAuth({ roles: ['ADMIN', 'SUPER_ADMIN'] })

    const { eventId, action } = await validateRequest(request, moderateEventSchema)

    const result = await moderateEvent({ eventId, action })

    return NextResponse.json(result)
}, 'Moderation')
