import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { createUniversitySchema } from '@/lib/validators/admin-universities'
import { createUniversity } from '@/data-access/universities'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })

    const { name, shortName } = await validateRequest(request, createUniversitySchema)

    const result = await createUniversity({ name, shortName })

    return NextResponse.json(result)
}, 'Create university')
