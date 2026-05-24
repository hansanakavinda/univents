import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { deleteGigSchema } from '@/lib/validators/gigs'
import { deleteGigById, getGigById } from '@/data-access/gigs'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { gigId } = await validateRequest(request, deleteGigSchema)

    const gig = await getGigById(gigId)
    if (!gig) {
        return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    // Only allow author or admins to delete
    if (gig.authorId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await deleteGigById(gigId)
    return NextResponse.json(result)
}, 'Delete gig')
