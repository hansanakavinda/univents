import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { createCategorySchema, updateCategorySchema, deleteCategorySchema } from '@/lib/validators/admin-categories'
import { createCategory, updateCategory, deleteCategory } from '@/data-access/categories'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })
    const { name } = await validateRequest(request, createCategorySchema)
    const category = await createCategory(name)
    return NextResponse.json({ success: true, category })
}, 'Create category')

export const PUT = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })
    const { id, name } = await validateRequest(request, updateCategorySchema)
    const category = await updateCategory(id, name)
    return NextResponse.json({ success: true, category })
}, 'Update category')

export const DELETE = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })
    const { id } = await validateRequest(request, deleteCategorySchema)
    const result = await deleteCategory(id)
    return NextResponse.json(result)
}, 'Delete category')
