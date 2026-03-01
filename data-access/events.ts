import { ApiError } from "@/lib/api/api-utils"
import { prisma } from "@/lib/prisma"

export const moderateEvent = async ({ eventId, action }: { eventId: string, action: 'approve' | 'reject' }) => {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true },
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
        await prisma.event.delete({
            where: { id: eventId },
        })
    }

    return { success: true }
}

export const createEvent = async ({
    title,
    content,
    imagePath,
    location,
    startDate,
    endDate,
    uniId,
    otherInfo,
    authorId,
}: {
    title: string
    content: string
    imagePath: string
    location: string
    startDate: Date
    endDate: Date
    uniId: string
    otherInfo?: string
    authorId: string
}) => {
    const event = await prisma.event.create({
        data: {
            title: title.trim(),
            content: content.trim(),
            imagePath,
            location: location.trim(),
            startDate,
            endDate,
            uniId,
            otherInfo: otherInfo?.trim(),
            authorId,
            isApproved: false,
        },
    })

    return { success: true, event }
}

export const getPendingEvents = async () => {
    const events = await prisma.event.findMany({
        where: { isApproved: false },
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
        orderBy: { startDate: 'asc' },
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

export const getApprovedEventsPaginated = async (options?: { take?: number; skip?: number }) => {
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
        orderBy: { startDate: 'asc' },
        take: options?.take ?? 4,
        skip: options?.skip ?? 0,
    })

    return events
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
