import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { deleteHustleSchema } from '@/lib/validators/hustles'
import { deleteHustleById, getHustleById } from '@/data-access/hustles'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { hustleId } = await validateRequest(request, deleteHustleSchema)

    const hustle = await getHustleById(hustleId)
    if (!hustle) {
        return NextResponse.json({ error: 'Hustle not found' }, { status: 404 })
    }

    // Only allow author or admins to delete
    if (hustle.authorId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await deleteHustleById(hustleId)
    return NextResponse.json(result)
}, 'Delete hustle')
