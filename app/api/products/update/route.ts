import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { updateProductSchema } from '@/lib/validators/products'
import { updateProduct } from '@/data-access/products'
import { deleteImage } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { productId, title, description, priceType, price, contactNo, categoryId, uniId, imagePath, discardedImageIds } =
        await validateRequest(request, updateProductSchema)

    const result = await updateProduct({
        productId,
        title,
        description,
        priceType,
        price,
        contactNo,
        categoryId,
        uniId,
        authorId: session.user.id,
        imagePath: imagePath || null,
    })

    // Clean up discarded images
    if (discardedImageIds?.length) {
        for (const publicId of discardedImageIds) {
            if (!publicId.startsWith('univents/')) continue

            const inUse = await prisma.product.findFirst({
                where: { imagePath: { contains: publicId } },
                select: { id: true },
            })
            if (inUse) continue

            deleteImage(publicId).catch(() => { })
        }
    }

    return NextResponse.json(result)
}, 'Update product')
