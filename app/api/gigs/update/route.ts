import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { updateGigSchema } from '@/lib/validators/gigs'
import { updateGig } from '@/data-access/gigs'
import { deleteImage } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { gigId, title, description, priceType, minPrice, maxPrice, contactNo, categoryId, uniId, imagePath, discardedImageIds } =
        await validateRequest(request, updateGigSchema)

    const result = await updateGig({
        gigId,
        title,
        description,
        priceType,
        minPrice,
        maxPrice,
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

            const inUse = await prisma.gig.findFirst({
                where: { imagePath: { contains: publicId } },
                select: { id: true },
            })
            if (inUse) continue

            deleteImage(publicId).catch(() => { })
        }
    }

    return NextResponse.json(result)
}, 'Update gig')
