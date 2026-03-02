import { ApiError } from "@/lib/api/api-utils"
import { prisma } from "@/lib/prisma"

export const getAllUniversities = async () => {
    const universities = await prisma.university.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: {
                    events: true,
                    users: true,
                },
            },
        },
    })

    return universities
}

export const createUniversity = async ({ name, shortName }: { name: string; shortName: string }) => {
    const university = await prisma.university.create({
        data: {
            name: name.trim(),
            shortName: shortName.trim(),
        },
    })

    return { success: true, university }
}

export const updateUniversity = async ({ id, name, shortName }: { id: string; name: string; shortName: string }) => {
    const existing = await prisma.university.findUnique({
        where: { id },
        select: { id: true },
    })

    if (!existing) {
        throw new ApiError('University not found', 404)
    }

    const university = await prisma.university.update({
        where: { id },
        data: {
            name: name.trim(),
            shortName: shortName.trim(),
        },
    })

    return { success: true, university }
}

export const deleteUniversity = async (id: string) => {
    const existing = await prisma.university.findUnique({
        where: { id },
        select: { id: true, _count: { select: { events: true, users: true } } },
    })

    if (!existing) {
        throw new ApiError('University not found', 404)
    }

    if (existing._count.events > 0 || existing._count.users > 0) {
        throw new ApiError(
            `Cannot delete university with ${existing._count.events} event(s) and ${existing._count.users} user(s). Remove associated records first.`,
            400
        )
    }

    await prisma.university.delete({
        where: { id },
    })

    return { success: true }
}
