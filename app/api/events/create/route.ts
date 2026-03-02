import { requireAuth } from '@/lib/api/api-auth'
import { asyncCatcher, validateRequest } from '@/lib/api/api-utils'
import { createEventSchema } from '@/lib/validators/events'
import { createEvent } from '@/data-access/events'
import { deleteImage } from '@/lib/cloudinary'
import { NextResponse } from 'next/server'

export const POST = asyncCatcher(async (request: Request) => {
    const session = await requireAuth()

    if (!session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { title, content, imagePath, startDate, endDate, uniId, discardedImageIds } =
        await validateRequest(request, createEventSchema)

    const result = await createEvent({
        title,
        content,
        imagePath: imagePath || undefined,
        startDate,
        endDate,
        uniId,
        authorId: session.user.id,
    })

    // Clean up discarded images from Cloudinary (fire-and-forget)
    if (discardedImageIds?.length) {
        for (const publicId of discardedImageIds) {
            deleteImage(publicId).catch(() => { })
        }
    }

    return NextResponse.json(result)
}, 'Create event')
