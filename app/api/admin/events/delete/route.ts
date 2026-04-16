import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { deleteEventSchema } from '@/lib/validators/admin-events'
import { deleteEventById } from '@/data-access/events'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    // SECURITY: Uses fresh DB check — not cached JWT — for delete actions
    await requireFreshAuth({ roles: ['ADMIN', 'SUPER_ADMIN'] })

    const { eventId } = await validateRequest(request, deleteEventSchema)

    const result = await deleteEventById(eventId)

    return NextResponse.json(result)
}, 'Delete Event')
