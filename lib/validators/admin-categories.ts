import { z } from 'zod'

export const createCategorySchema = z.object({
    name: z.string().trim().min(1, 'Category name is required').max(100, 'Category name must be 100 characters or less'),
})

export const updateCategorySchema = z.object({
    id: z.string().min(1, 'Category ID is required'),
    name: z.string().trim().min(1, 'Category name is required').max(100, 'Category name must be 100 characters or less'),
})

export const deleteCategorySchema = z.object({
    id: z.string().min(1, 'Category ID is required'),
})
