import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { createHustleSchema } from '@/lib/validators/hustles'
import { createHustle } from '@/data-access/hustles'
import { deleteImage } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { notifyAdminsNewContent } from '@/lib/email-notifications'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { title, description, hustleType, workMode, priceType, minPrice, maxPrice, contactNo, categoryId, imagePath, discardedImageIds } =
        await validateRequest(request, createHustleSchema)

    const result = await createHustle({
        title,
        description,
        hustleType,
        workMode,
        priceType,
        minPrice,
        maxPrice,
        contactNo,
        categoryId,
        authorId: session.user.id,
        imagePath: imagePath || null,
    })

    if (result.success && result.hustle) {
        notifyAdminsNewContent('Hustle', result.hustle.title).catch((err) =>
            console.error('[email] Failed to notify admins of new hustle:', err)
        )
    }



    // Clean up discarded images from Cloudinary
    if (discardedImageIds?.length) {
        for (const publicId of discardedImageIds) {
            if (!publicId.startsWith('univents/')) continue

            const inUse = await prisma.hustle.findFirst({
                where: { imagePath: { contains: publicId } },
                select: { id: true },
            })
            if (inUse) continue

            deleteImage(publicId).catch(() => { })
        }
    }

    return NextResponse.json(result)
}, 'Create hustle')
