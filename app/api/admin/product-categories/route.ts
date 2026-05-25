import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { createProductCategorySchema, updateProductCategorySchema, deleteProductCategorySchema } from '@/lib/validators/admin-product-categories'
import { createProductCategory, updateProductCategory, deleteProductCategory } from '@/data-access/product-categories'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })
    const { name } = await validateRequest(request, createProductCategorySchema)
    const category = await createProductCategory(name)
    return NextResponse.json({ success: true, category })
}, 'Create product category')

export const PUT = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })
    const { id, name } = await validateRequest(request, updateProductCategorySchema)
    const category = await updateProductCategory(id, name)
    return NextResponse.json({ success: true, category })
}, 'Update product category')

export const DELETE = asyncCatcher(async (request: Request) => {
    await requireFreshAuth({ roles: ['SUPER_ADMIN'] })
    const { id } = await validateRequest(request, deleteProductCategorySchema)
    const result = await deleteProductCategory(id)
    return NextResponse.json(result)
}, 'Delete product category')
