import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { createHustleCategorySchema, updateHustleCategorySchema, deleteHustleCategorySchema } from '@/lib/validators/admin-hustle-categories'
import { createHustleCategory, updateHustleCategory, deleteHustleCategory } from '@/data-access/hustle-categories'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })
    const { name } = await validateRequest(request, createHustleCategorySchema)
    const category = await createHustleCategory(name)
    return NextResponse.json({ success: true, category })
}, 'Create hustle category')

export const PUT = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })
    const { id, name } = await validateRequest(request, updateHustleCategorySchema)
    const category = await updateHustleCategory(id, name)
    return NextResponse.json({ success: true, category })
}, 'Update hustle category')

export const DELETE = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })
    const { id } = await validateRequest(request, deleteHustleCategorySchema)
    const result = await deleteHustleCategory(id)
    return NextResponse.json(result)
}, 'Delete hustle category')
