import { ApiError } from "@/lib/api/api-utils"
import { prisma } from "@/lib/prisma"
import { deleteImage } from "@/lib/cloudinary"

function extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.*?)(?:\.\w+)?$/)
    return match?.[1] ?? null
}

export const createHustle = async ({
    title,
    description,
    hustleType,
    workMode,
    priceType,
    minPrice,
    maxPrice,
    contactNo,
    categoryId,
    authorId,
    imagePath,
}: {
    title: string
    description: string
    hustleType: string
    workMode: string
    priceType?: string | null
    minPrice?: number | null
    maxPrice?: number | null
    contactNo?: string | null
    categoryId: string
    authorId: string
    imagePath?: string | null
}) => {
    const hustle = await prisma.hustle.create({
        data: {
            title: title.trim(),
            description: description.trim(),
            hustleType,
            workMode,
            priceType: priceType || null,
            minPrice: priceType ? minPrice : null,
            maxPrice: priceType === 'RANGE' ? maxPrice : null,
            contactNo: contactNo ? contactNo.trim() : null,
            categoryId,
            authorId,
            imagePath: imagePath || null,
            isApproved: false,
        },
    })

    return { success: true, hustle }
}

export const updateHustle = async ({
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
    authorId,
    imagePath,
}: {
    hustleId: string
    title: string
    description: string
    hustleType: string
    workMode: string
    priceType?: string | null
    minPrice?: number | null
    maxPrice?: number | null
    contactNo?: string | null
    categoryId: string
    authorId: string
    imagePath?: string | null
}) => {
    const existing = await prisma.hustle.findUnique({
        where: { id: hustleId },
        select: { id: true, authorId: true, imagePath: true },
    })

    if (!existing) {
        throw new ApiError('Hustle listing not found', 404)
    }

    if (existing.authorId !== authorId) {
        throw new ApiError('You can only edit your own hustles', 403)
    }

    // Clean up old image if changed
    if (existing.imagePath && existing.imagePath !== imagePath) {
        const publicId = extractPublicId(existing.imagePath)
        if (publicId) {
            deleteImage(publicId).catch(() => { })
        }
    }

    const hustle = await prisma.hustle.update({
        where: { id: hustleId },
        data: {
            title: title.trim(),
            description: description.trim(),
            hustleType,
            workMode,
            priceType: priceType || null,
            minPrice: priceType ? minPrice : null,
            maxPrice: priceType === 'RANGE' ? maxPrice : null,
            contactNo: contactNo ? contactNo.trim() : null,
            categoryId,
            imagePath: imagePath || null,
            isApproved: false, // Re-submit for moderation
        },
    })

    return { success: true, hustle }
}

export const deleteHustleById = async (hustleId: string) => {
    const hustle = await prisma.hustle.findUnique({
        where: { id: hustleId },
        select: { id: true, imagePath: true },
    })

    if (!hustle) {
        throw new ApiError('Hustle not found', 404)
    }

    if (hustle.imagePath) {
        const publicId = extractPublicId(hustle.imagePath)
        if (publicId) {
            deleteImage(publicId).catch(() => { })
        }
    }

    await prisma.hustle.delete({
        where: { id: hustleId },
    })

    return { success: true }
}

export const getHustleById = async (id: string) => {
    return await prisma.hustle.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    name: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })
}

export const getPendingHustles = async () => {
    return await prisma.hustle.findMany({
        where: {
            isApproved: false,
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })
}

export const getRecentApprovedHustles = async (options?: { take?: number }) => {
    return await prisma.hustle.findMany({
        where: {
            isApproved: true,
        },
        include: {
            author: {
                select: {
                    name: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: { updatedAt: 'desc' },
        take: options?.take ?? 10,
    })
}

export const getApprovedHustlesPaginated = async (options?: {
    take?: number
    skip?: number
    categoryId?: string
    hustleType?: string
    workMode?: string
    priceType?: string
    search?: string
}) => {
    const where: {
        isApproved: boolean
        categoryId?: string
        hustleType?: string
        workMode?: string
        priceType?: string
        OR?: Array<{
            title?: { contains: string; mode: 'insensitive' }
            description?: { contains: string; mode: 'insensitive' }
        }>
    } = { isApproved: true }

    if (options?.categoryId) {
        where.categoryId = options.categoryId
    }

    if (options?.hustleType) {
        where.hustleType = options.hustleType
    }

    if (options?.workMode) {
        where.workMode = options.workMode
    }

    if (options?.priceType) {
        where.priceType = options.priceType
    }

    if (options?.search) {
        where.OR = [
            { title: { contains: options.search, mode: 'insensitive' } },
            { description: { contains: options.search, mode: 'insensitive' } },
        ]
    }

    return await prisma.hustle.findMany({
        where,
        include: {
            author: {
                select: {
                    name: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: options?.take ?? 8,
        skip: options?.skip ?? 0,
    })
}

export const getUserHustles = async (userId: string, options?: { take?: number; skip?: number }) => {
    return await prisma.hustle.findMany({
        where: { authorId: userId },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        ...(options?.take && { take: options.take }),
        ...(options?.skip && { skip: options.skip }),
    })
}

export const getUserHustleStats = async (userId: string) => {
    const totalHustles = await prisma.hustle.count({
        where: { authorId: userId },
    })

    const approvedHustles = await prisma.hustle.count({
        where: {
            authorId: userId,
            isApproved: true,
        },
    })

    const pendingHustles = await prisma.hustle.count({
        where: {
            authorId: userId,
            isApproved: false,
        },
    })

    return {
        totalHustles,
        approvedHustles,
        pendingHustles,
    }
}

export const getHustleStats = async () => {
    const pending = await prisma.hustle.count({ where: { isApproved: false } })
    const approved = await prisma.hustle.count({ where: { isApproved: true } })
    const total = await prisma.hustle.count({ })

    return { pending, approved, total }
}

export const moderateHustle = async ({ hustleId, action }: { hustleId: string; action: 'approve' | 'reject' }) => {
    const hustle = await prisma.hustle.findUnique({
        where: { id: hustleId },
        select: { id: true, imagePath: true, title: true },
    })

    if (!hustle) {
        throw new ApiError('Hustle not found', 404)
    }

    if (action === 'approve') {
        const approvedHustle = await prisma.hustle.update({
            where: { id: hustleId },
            data: { isApproved: true },
        })
        return { success: true, hustle: approvedHustle }
    } else {
        if (hustle.imagePath) {
            const publicId = extractPublicId(hustle.imagePath)
            if (publicId) {
                deleteImage(publicId).catch(() => { })
            }
        }
        await prisma.hustle.delete({
            where: { id: hustleId },
        })
        return { success: true, hustle: null }
    }
}
