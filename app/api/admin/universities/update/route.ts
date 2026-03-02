import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { updateUniversitySchema } from '@/lib/validators/admin-universities'
import { updateUniversity } from '@/data-access/universities'
import { NextResponse } from 'next/server'

export const PUT = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })

    const { id, name, shortName } = await validateRequest(request, updateUniversitySchema)

    const result = await updateUniversity({ id, name, shortName })

    return NextResponse.json(result)
}, 'Update university')
