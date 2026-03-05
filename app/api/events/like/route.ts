import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { toggleEventLike } from '@/data-access/events'
import { NextResponse } from 'next/server'
import { likeSchema } from '@/lib/validators/events'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    const { eventId } = await validateRequest(request, likeSchema)

    const data = await toggleEventLike(eventId, session.user.id!)

    return NextResponse.json(data)
}, 'Toggle event like')
