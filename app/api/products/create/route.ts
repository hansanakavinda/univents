import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { createProductSchema } from '@/lib/validators/products'
import { createProduct } from '@/data-access/products'
import { deleteImage } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { notifyAdminsNewContent } from '@/lib/email-notifications'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { title, description, priceType, price, contactNo, categoryId, uniId, imagePath, discardedImageIds } =
        await validateRequest(request, createProductSchema)

    const result = await createProduct({
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

    if (result.success && result.product) {
        notifyAdminsNewContent('Product', result.product.title).catch((err) =>
            console.error('[email] Failed to notify admins of new product:', err)
        )
    }



    // Clean up discarded images from Cloudinary
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
}, 'Create product')
