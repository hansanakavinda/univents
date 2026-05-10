import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { updateProfileSchema } from '@/lib/validators/users'
import { updateUserProfile } from '@/data-access/users'
import { NextResponse } from 'next/server'

export const PUT = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { name, uniId } = await validateRequest(request, updateProfileSchema)

    const updatedUser = await updateUserProfile({
        userId: session.user.id,
        name,
        uniId,
    })

    return NextResponse.json({
        message: 'Profile updated successfully',
        user: updatedUser
    })
})
