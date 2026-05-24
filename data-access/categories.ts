import { prisma } from "@/lib/prisma"
import { ApiError } from "@/lib/api/api-utils"

export const getAllCategories = async () => {
    return await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { gigs: true }
            }
        }
    })
}

export const createCategory = async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
        throw new ApiError('Category name cannot be empty', 400)
    }

    const existing = await prisma.category.findUnique({
        where: { name: trimmed },
    })

    if (existing) {
        throw new ApiError('Category name already exists', 400)
    }

    return await prisma.category.create({
        data: { name: trimmed },
    })
}

export const updateCategory = async (id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
        throw new ApiError('Category name cannot be empty', 400)
    }

    const existing = await prisma.category.findUnique({
        where: { name: trimmed },
    })

    if (existing && existing.id !== id) {
        throw new ApiError('Category name already exists', 400)
    }

    return await prisma.category.update({
        where: { id },
        data: { name: trimmed },
    })
}

export const deleteCategory = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            _count: {
                select: { gigs: true }
            }
        }
    })

    if (!category) {
        throw new ApiError('Category not found', 404)
    }

    if (category._count.gigs > 0) {
        throw new ApiError('Cannot delete category because it has active gigs', 400)
    }

    await prisma.category.delete({
        where: { id },
    })

    return { success: true }
}
