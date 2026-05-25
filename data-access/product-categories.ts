import { prisma } from "@/lib/prisma"
import { ApiError } from "@/lib/api/api-utils"

export const getAllProductCategories = async () => {
    return await prisma.productCategory.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { products: true }
            }
        }
    })
}

export const createProductCategory = async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
        throw new ApiError('Category name cannot be empty', 400)
    }

    const existing = await prisma.productCategory.findUnique({
        where: { name: trimmed },
    })

    if (existing) {
        throw new ApiError('Category name already exists', 400)
    }

    return await prisma.productCategory.create({
        data: { name: trimmed },
    })
}

export const updateProductCategory = async (id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
        throw new ApiError('Category name cannot be empty', 400)
    }

    const existing = await prisma.productCategory.findUnique({
        where: { name: trimmed },
    })

    if (existing && existing.id !== id) {
        throw new ApiError('Category name already exists', 400)
    }

    return await prisma.productCategory.update({
        where: { id },
        data: { name: trimmed },
    })
}

export const deleteProductCategory = async (id: string) => {
    const category = await prisma.productCategory.findUnique({
        where: { id },
        include: {
            _count: {
                select: { products: true }
            }
        }
    })

    if (!category) {
        throw new ApiError('Category not found', 404)
    }

    if (category._count.products > 0) {
        throw new ApiError('Cannot delete category because it has active products', 400)
    }

    await prisma.productCategory.delete({
        where: { id },
    })

    return { success: true }
}
