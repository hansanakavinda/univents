import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { deleteUniversitySchema } from '@/lib/validators/admin-universities'
import { deleteUniversity } from '@/data-access/universities'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })

    const { id } = await validateRequest(request, deleteUniversitySchema)

    const result = await deleteUniversity(id)

    return NextResponse.json(result)
}, 'Delete university')
