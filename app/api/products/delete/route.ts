import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { deleteProductSchema } from '@/lib/validators/products'
import { deleteProductById, getProductById } from '@/data-access/products'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { productId } = await validateRequest(request, deleteProductSchema)

    const product = await getProductById(productId)
    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Only allow author or admins to delete
    if (product.authorId !== session.user.id && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await deleteProductById(productId)
    return NextResponse.json(result)
}, 'Delete product')
