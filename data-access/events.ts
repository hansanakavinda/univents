import { ApiError } from "@/lib/api/api-utils"
import { prisma } from "@/lib/prisma"
import { deleteImage } from "@/lib/cloudinary"

/**
 * Extract the Cloudinary public ID from a Cloudinary URL.
 * e.g. https://res.cloudinary.com/xxx/image/upload/v123/univents/events/abc.jpg -> univents/events/abc
 */
function extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.*?)(?:\.\w+)?$/)
    return match?.[1] ?? null
}

export const moderateEvent = async ({ eventId, action }: { eventId: string, action: 'approve' | 'reject' }) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true, imagePath: true },
    })

    if (!event) {
        throw new ApiError('Event not found', 404)
    }

    if (action === 'approve') {
        await prisma.event.update({
            where: { id: eventId },
            data: { isApproved: true },
        })
    } else {
        // Delete the event's image from Cloudinary if it exists
        if (event.imagePath) {
            const publicId = extractPublicId(event.imagePath)
            if (publicId) {
                deleteImage(publicId).catch(() => { })
            }
        }
        await prisma.event.delete({
            where: { id: eventId },
        })
    }

    return { success: true }
}

export const deleteEventById = async (eventId: string) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true, imagePath: true },
    })

    if (!event) {
        throw new ApiError('Event not found', 404)
    }

    // Delete the event's image from Cloudinary if it exists
    if (event.imagePath) {
        const publicId = extractPublicId(event.imagePath)
        if (publicId) {
            deleteImage(publicId).catch(() => { })
        }
    }

    await prisma.event.delete({
        where: { id: eventId },
    })

    return { success: true }
}

export const createEvent = async ({
    title,
    content,
    imagePath,
    endDate,
    uniId,
    authorId,
}: {
    title: string
    content: string
    imagePath?: string
    endDate: Date
    uniId: string
    authorId: string
}) => {
    const event = await prisma.event.create({
        data: {
            title: title.trim(),
            content: content.trim(),
            imagePath,
            endDate,
            uniId,
            authorId,
            isApproved: false,
        },
    })

    return { success: true, event }
}

export const getPendingEvents = async (options?: { uniId?: string }) => {
    const events = await prisma.event.findMany({
        where: {
            isApproved: false,
            ...(options?.uniId && { uniId: options.uniId }),
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    role: true,
                },
            },
            university: {
                select: {
                    name: true,
                    shortName: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    return events
}

export const getRecentApprovedEvents = async (options?: { uniId?: string; take?: number }) => {
    const events = await prisma.event.findMany({
        where: {
            isApproved: true,
            ...(options?.uniId && { uniId: options.uniId }),
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                },
            },
            university: {
                select: {
                    name: true,
                    shortName: true,
                },
            },
        },
        orderBy: { updatedAt: 'desc' },
        take: options?.take ?? 10,
    })

    return events
}

export const getEventStats = async (options?: { uniId?: string }) => {
    const where = options?.uniId ? { uniId: options.uniId } : {}

    const pending = await prisma.event.count({ where: { ...where, isApproved: false } })
    const approved = await prisma.event.count({ where: { ...where, isApproved: true } })
    const total = await prisma.event.count({ where })

    return { pending, approved, total }
}

export const getApprovedEvents = async () => {
    const events = await prisma.event.findMany({
        where: { isApproved: true },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    role: true,
                },
            },
            university: {
                select: {
                    name: true,
                    shortName: true,
                },
            },
        },
        orderBy: { endDate: 'asc' },
    })

    return events
}

export const getUserEvents = async (userId: string, options?: { take?: number; skip?: number }) => {
    const events = await prisma.event.findMany({
        where: { authorId: userId },
        include: {
            university: {
                select: {
                    name: true,
                    shortName: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        ...(options?.take && { take: options.take }),
        ...(options?.skip && { skip: options.skip }),
    })

    return events
}

export const getApprovedEventsPaginated = async (options?: { take?: number; skip?: number; userId?: string; uniId?: string; sortBy?: 'recent' | 'happening' }) => {
    const sortBy = options?.sortBy ?? 'recent'

    const where: Record<string, unknown> = { isApproved: true }
    if (options?.uniId) {
        where.uniId = options.uniId
    }
    if (sortBy === 'happening') {
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)
        where.endDate = { gte: startOfToday }
    }

    const orderBy = sortBy === 'happening'
        ? { endDate: 'asc' as const }
        : { createdAt: 'desc' as const }

    const events = await prisma.event.findMany({
        where,
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    role: true,
                },
            },
            university: {
                select: {
                    name: true,
                    shortName: true,
                },
            },
            _count: {
                select: { likes: true },
            },
            ...(options?.userId && {
                likes: {
                    where: { userId: options.userId },
                    select: { id: true },
                    take: 1,
                },
            }),
        },
        orderBy,
        take: options?.take ?? 4,
        skip: options?.skip ?? 0,
    })

    return events.map(event => ({
        ...event,
        likeCount: event._count.likes,
        isLikedByUser: 'likes' in event ? (event.likes as unknown[]).length > 0 : false,
    }))
}

export const getUserEventStats = async (userId: string) => {
    const totalEvents = await prisma.event.count({
        where: { authorId: userId },
    })

    const approvedEvents = await prisma.event.count({
        where: {
            authorId: userId,
            isApproved: true,
        },
    })

    const pendingEvents = await prisma.event.count({
        where: {
            authorId: userId,
            isApproved: false,
        },
    })

    return {
        totalEvents,
        approvedEvents,
        pendingEvents,
    }
}

export const toggleEventLike = async (eventId: string, userId: string) => {
    const existing = await prisma.eventLike.findUnique({
        where: {
            eventId_userId: { eventId, userId },
        },
    })

    if (existing) {
        await prisma.eventLike.delete({
            where: { id: existing.id },
        })
    } else {
        await prisma.eventLike.create({
            data: { eventId, userId },
        })
    }

    const likeCount = await prisma.eventLike.count({
        where: { eventId },
    })

    return { liked: !existing, likeCount }
}

/**
 * Fetch a single event by ID with author and university details.
 * Used by the /events/[id] detail page for SEO metadata and JSON-LD.
 */
export const getEventById = async (id: string) => {
    const event = await prisma.event.findUnique({
        where: { id, isApproved: true },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                },
            },
            university: {
                select: {
                    name: true,
                    shortName: true,
                },
            },
            _count: {
                select: { likes: true },
            },
        },
    })

    return event
}

/**
 * Fetch all approved event IDs for sitemap generation and static params.
 */
export const getAllApprovedEventIds = async () => {
    const events = await prisma.event.findMany({
        where: { isApproved: true },
        select: { id: true, updatedAt: true },
    })
    return events
}

