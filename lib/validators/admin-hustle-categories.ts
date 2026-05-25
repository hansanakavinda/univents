import { z } from 'zod'

export const createHustleCategorySchema = z.object({
    name: z.string().trim().min(1, 'Category name is required').max(100, 'Category name must be 100 characters or less'),
})

export const updateHustleCategorySchema = z.object({
    id: z.string().min(1, 'Category ID is required'),
    name: z.string().trim().min(1, 'Category name is required').max(100, 'Category name must be 100 characters or less'),
})

export const deleteHustleCategorySchema = z.object({
    id: z.string().min(1, 'Category ID is required'),
})
