import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { updateHustleSchema } from '@/lib/validators/hustles'
import { updateHustle } from '@/data-access/hustles'
import { deleteImage } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { hustleId, title, description, hustleType, workMode, priceType, minPrice, maxPrice, contactNo, categoryId, imagePath, discardedImageIds } =
        await validateRequest(request, updateHustleSchema)

    const result = await updateHustle({
        hustleId,
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

    // Clean up discarded images
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
}, 'Update hustle')
