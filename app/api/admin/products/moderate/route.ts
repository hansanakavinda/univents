import { requireFreshAuth } from '@/lib/api/auth-checks'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { moderateProductSchema } from '@/lib/validators/products'
import { moderateProduct } from '@/data-access/products'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    // SECURITY: DB freshness check for high-risk admin actions
    await requireFreshAuth({ roles: ['ADMIN', 'SUPER_ADMIN'] })

    const { productId, action } = await validateRequest(request, moderateProductSchema)

    const result = await moderateProduct({ productId, action })

    return NextResponse.json({ success: result.success })
}, 'Moderate product')
