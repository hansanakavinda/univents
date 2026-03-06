import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { changeUniversitySchema } from '@/lib/validators/admin-users'
import { changeUserUniversity } from '@/data-access/users'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    // SECURITY: Uses fresh DB check
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })

    const { userId, uniId } = await validateRequest(request, changeUniversitySchema)

    const result = await changeUserUniversity({ userId, uniId })

    return NextResponse.json(result)
}, 'Change university')
