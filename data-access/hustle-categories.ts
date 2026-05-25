import { prisma } from "@/lib/prisma"
import { ApiError } from "@/lib/api/api-utils"

export const getAllHustleCategories = async () => {
    return await prisma.hustleCategory.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { hustles: true }
            }
        }
    })
}

export const createHustleCategory = async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
        throw new ApiError('Category name cannot be empty', 400)
    }

    const existing = await prisma.hustleCategory.findUnique({
        where: { name: trimmed },
    })

    if (existing) {
        throw new ApiError('Category name already exists', 400)
    }

    return await prisma.hustleCategory.create({
        data: { name: trimmed },
    })
}

export const updateHustleCategory = async (id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
        throw new ApiError('Category name cannot be empty', 400)
    }

    const existing = await prisma.hustleCategory.findUnique({
        where: { name: trimmed },
    })

    if (existing && existing.id !== id) {
        throw new ApiError('Category name already exists', 400)
    }

    return await prisma.hustleCategory.update({
        where: { id },
        data: { name: trimmed },
    })
}

export const deleteHustleCategory = async (id: string) => {
    const category = await prisma.hustleCategory.findUnique({
        where: { id },
        include: {
            _count: {
                select: { hustles: true }
            }
        }
    })

    if (!category) {
        throw new ApiError('Category not found', 404)
    }

    if (category._count.hustles > 0) {
        throw new ApiError('Cannot delete category because it has active hustles', 400)
    }

    await prisma.hustleCategory.delete({
        where: { id },
    })

    return { success: true }
}
