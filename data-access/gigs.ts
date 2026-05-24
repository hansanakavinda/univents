import { ApiError } from "@/lib/api/api-utils"
import { prisma } from "@/lib/prisma"
import { deleteImage } from "@/lib/cloudinary"

function extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.*?)(?:\.\w+)?$/)
    return match?.[1] ?? null
}

export const createGig = async ({
    title,
    description,
    priceType,
    minPrice,
    maxPrice,
    contactNo,
    categoryId,
    uniId,
    authorId,
    imagePath,
}: {
    title: string
    description: string
    priceType: string
    minPrice?: number | null
    maxPrice?: number | null
    contactNo: string
    categoryId: string
    uniId: string
    authorId: string
    imagePath?: string | null
}) => {
    const gig = await prisma.gig.create({
        data: {
            title: title.trim(),
            description: description.trim(),
            priceType,
            minPrice: minPrice ?? null,
            maxPrice: maxPrice ?? null,
            contactNo: contactNo.trim(),
            categoryId,
            uniId,
            authorId,
            imagePath: imagePath || null,
            isApproved: false,
        },
    })

    return { success: true, gig }
}

export const updateGig = async ({
    gigId,
    title,
    description,
    priceType,
    minPrice,
    maxPrice,
    contactNo,
    categoryId,
    uniId,
    authorId,
    imagePath,
}: {
    gigId: string
    title: string
    description: string
    priceType: string
    minPrice?: number | null
    maxPrice?: number | null
    contactNo: string
    categoryId: string
    uniId: string
    authorId: string
    imagePath?: string | null
}) => {
    const existing = await prisma.gig.findUnique({
        where: { id: gigId },
        select: { id: true, authorId: true, imagePath: true },
    })

    if (!existing) {
        throw new ApiError('Gig not found', 404)
    }

    if (existing.authorId !== authorId) {
        throw new ApiError('You can only edit your own gigs', 403)
    }

    // Clean up old image if changed
    if (existing.imagePath && existing.imagePath !== imagePath) {
        const publicId = extractPublicId(existing.imagePath)
        if (publicId) {
            deleteImage(publicId).catch(() => { })
        }
    }

    const gig = await prisma.gig.update({
        where: { id: gigId },
        data: {
            title: title.trim(),
            description: description.trim(),
            priceType,
            minPrice: minPrice ?? null,
            maxPrice: maxPrice ?? null,
            contactNo: contactNo.trim(),
            categoryId,
            uniId,
            imagePath: imagePath || null,
            isApproved: false, // Re-submit for moderation
        },
    })

    return { success: true, gig }
}

export const deleteGigById = async (gigId: string) => {
    const gig = await prisma.gig.findUnique({
        where: { id: gigId },
        select: { id: true, imagePath: true },
    })

    if (!gig) {
        throw new ApiError('Gig not found', 404)
    }

    if (gig.imagePath) {
        const publicId = extractPublicId(gig.imagePath)
        if (publicId) {
            deleteImage(publicId).catch(() => { })
        }
    }

    await prisma.gig.delete({
        where: { id: gigId },
    })

    return { success: true }
}

export const getGigById = async (id: string) => {
    return await prisma.gig.findUnique({
        where: { id },
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
                    id: true,
                    name: true,
                    shortName: true,
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

export const getPendingGigs = async (options?: { uniId?: string }) => {
    return await prisma.gig.findMany({
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
                    id: true,
                    name: true,
                    shortName: true,
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

export const getRecentApprovedGigs = async (options?: { uniId?: string; take?: number }) => {
    return await prisma.gig.findMany({
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
                    id: true,
                    name: true,
                    shortName: true,
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

export const getApprovedGigsPaginated = async (options?: {
    take?: number
    skip?: number
    uniId?: string
    categoryId?: string
    priceType?: string
    search?: string
}) => {
    const where: {
        isApproved: boolean
        uniId?: string
        categoryId?: string
        priceType?: string
        OR?: Array<{
            title?: { contains: string; mode: 'insensitive' }
            description?: { contains: string; mode: 'insensitive' }
        }>
    } = { isApproved: true }

    if (options?.uniId) {
        where.uniId = options.uniId
    }

    if (options?.categoryId) {
        where.categoryId = options.categoryId
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

    return await prisma.gig.findMany({
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
                    id: true,
                    name: true,
                    shortName: true,
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

export const getUserGigs = async (userId: string, options?: { take?: number; skip?: number }) => {
    return await prisma.gig.findMany({
        where: { authorId: userId },
        include: {
            university: {
                select: {
                    id: true,
                    name: true,
                    shortName: true,
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
        ...(options?.take && { take: options.take }),
        ...(options?.skip && { skip: options.skip }),
    })
}

export const getUserGigStats = async (userId: string) => {
    const totalGigs = await prisma.gig.count({
        where: { authorId: userId },
    })

    const approvedGigs = await prisma.gig.count({
        where: {
            authorId: userId,
            isApproved: true,
        },
    })

    const pendingGigs = await prisma.gig.count({
        where: {
            authorId: userId,
            isApproved: false,
        },
    })

    return {
        totalGigs,
        approvedGigs,
        pendingGigs,
    }
}

export const getGigStats = async (options?: { uniId?: string }) => {
    const where = options?.uniId ? { uniId: options.uniId } : {}

    const pending = await prisma.gig.count({ where: { ...where, isApproved: false } })
    const approved = await prisma.gig.count({ where: { ...where, isApproved: true } })
    const total = await prisma.gig.count({ where })

    return { pending, approved, total }
}

export const moderateGig = async ({ gigId, action }: { gigId: string; action: 'approve' | 'reject' }) => {
    const gig = await prisma.gig.findUnique({
        where: { id: gigId },
        select: { id: true, imagePath: true, title: true },
    })

    if (!gig) {
        throw new ApiError('Gig not found', 404)
    }

    if (action === 'approve') {
        const approvedGig = await prisma.gig.update({
            where: { id: gigId },
            data: { isApproved: true },
        })
        return { success: true, gig: approvedGig }
    } else {
        if (gig.imagePath) {
            const publicId = extractPublicId(gig.imagePath)
            if (publicId) {
                deleteImage(publicId).catch(() => { })
            }
        }
        await prisma.gig.delete({
            where: { id: gigId },
        })
        return { success: true, gig: null }
    }
}
