import { ApiError } from "@/lib/api/api-utils"
import { prisma } from "@/lib/prisma"
import { deleteImage } from "@/lib/cloudinary"

function extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.*?)(?:\.\w+)?$/)
    return match?.[1] ?? null
}

export const createProduct = async ({
    title,
    description,
    priceType,
    price,
    contactNo,
    categoryId,
    uniId,
    authorId,
    imagePath,
}: {
    title: string
    description: string
    priceType: string
    price?: number | null
    contactNo: string
    categoryId: string
    uniId: string
    authorId: string
    imagePath?: string | null
}) => {
    const product = await prisma.product.create({
        data: {
            title: title.trim(),
            description: description.trim(),
            priceType,
            price: priceType === 'FIXED' ? price : null,
            contactNo: contactNo.trim(),
            categoryId,
            uniId,
            authorId,
            imagePath: imagePath || null,
            isApproved: false,
        },
    })

    return { success: true, product }
}

export const updateProduct = async ({
    productId,
    title,
    description,
    priceType,
    price,
    contactNo,
    categoryId,
    uniId,
    authorId,
    imagePath,
}: {
    productId: string
    title: string
    description: string
    priceType: string
    price?: number | null
    contactNo: string
    categoryId: string
    uniId: string
    authorId: string
    imagePath?: string | null
}) => {
    const existing = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, authorId: true, imagePath: true },
    })

    if (!existing) {
        throw new ApiError('Product not found', 404)
    }

    if (existing.authorId !== authorId) {
        throw new ApiError('You can only edit your own products', 403)
    }

    // Clean up old image if changed
    if (existing.imagePath && existing.imagePath !== imagePath) {
        const publicId = extractPublicId(existing.imagePath)
        if (publicId) {
            deleteImage(publicId).catch(() => { })
        }
    }

    const product = await prisma.product.update({
        where: { id: productId },
        data: {
            title: title.trim(),
            description: description.trim(),
            priceType,
            price: priceType === 'FIXED' ? price : null,
            contactNo: contactNo.trim(),
            categoryId,
            uniId,
            imagePath: imagePath || null,
            isApproved: false, // Re-submit for moderation
        },
    })

    return { success: true, product }
}

export const deleteProductById = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, imagePath: true },
    })

    if (!product) {
        throw new ApiError('Product not found', 404)
    }

    if (product.imagePath) {
        const publicId = extractPublicId(product.imagePath)
        if (publicId) {
            deleteImage(publicId).catch(() => { })
        }
    }

    await prisma.product.delete({
        where: { id: productId },
    })

    return { success: true }
}

export const getProductById = async (id: string) => {
    return await prisma.product.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    name: true,
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

export const getPendingProducts = async (options?: { uniId?: string }) => {
    return await prisma.product.findMany({
        where: {
            isApproved: false,
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
        orderBy: { createdAt: 'desc' },
    })
}

export const getRecentApprovedProducts = async (options?: { uniId?: string; take?: number }) => {
    return await prisma.product.findMany({
        where: {
            isApproved: true,
            ...(options?.uniId && { uniId: options.uniId }),
        },
        include: {
            author: {
                select: {
                    name: true,
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

export const getApprovedProductsPaginated = async (options?: {
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

    return await prisma.product.findMany({
        where,
        include: {
            author: {
                select: {
                    name: true,
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

export const getUserProducts = async (userId: string, options?: { take?: number; skip?: number }) => {
    return await prisma.product.findMany({
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

export const getUserProductStats = async (userId: string) => {
    const totalProducts = await prisma.product.count({
        where: { authorId: userId },
    })

    const approvedProducts = await prisma.product.count({
        where: {
            authorId: userId,
            isApproved: true,
        },
    })

    const pendingProducts = await prisma.product.count({
        where: {
            authorId: userId,
            isApproved: false,
        },
    })

    return {
        totalProducts,
        approvedProducts,
        pendingProducts,
    }
}

export const getProductStats = async (options?: { uniId?: string }) => {
    const where = options?.uniId ? { uniId: options.uniId } : {}

    const pending = await prisma.product.count({ where: { ...where, isApproved: false } })
    const approved = await prisma.product.count({ where: { ...where, isApproved: true } })
    const total = await prisma.product.count({ where })

    return { pending, approved, total }
}

export const moderateProduct = async ({ productId, action }: { productId: string; action: 'approve' | 'reject' }) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, imagePath: true, title: true },
    })

    if (!product) {
        throw new ApiError('Product not found', 404)
    }

    if (action === 'approve') {
        const approvedProduct = await prisma.product.update({
            where: { id: productId },
            data: { isApproved: true },
        })
        return { success: true, product: approvedProduct }
    } else {
        if (product.imagePath) {
            const publicId = extractPublicId(product.imagePath)
            if (publicId) {
                deleteImage(publicId).catch(() => { })
            }
        }
        await prisma.product.delete({
            where: { id: productId },
        })
        return { success: true, product: null }
    }
}
