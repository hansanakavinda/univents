import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { createEventSchema } from '@/lib/validators/events'
import { createEvent } from '@/data-access/events'
import { deleteImage } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { title, content, imagePath, endDate, uniId, discardedImageIds } =
        await validateRequest(request, createEventSchema)

    const result = await createEvent({
        title,
        content,
        imagePath: imagePath || undefined,
        endDate,
        uniId,
        authorId: session.user.id,
    })

    // Clean up discarded images from Cloudinary (fire-and-forget, with safety checks)
    if (discardedImageIds?.length) {
        for (const publicId of discardedImageIds) {
            // Only allow deletion within our app's upload folder
            if (!publicId.startsWith('univents/')) continue

            // Ensure the image isn't actively used by any event
            const inUse = await prisma.event.findFirst({
                where: { imagePath: { contains: publicId } },
                select: { id: true },
            })
            if (inUse) continue

            deleteImage(publicId).catch(() => { })
        }
    }

    return NextResponse.json(result)
}, 'Create event')
