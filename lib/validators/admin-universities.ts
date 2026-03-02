import { z } from 'zod'

export const createUniversitySchema = z.object({
    name: z.string().trim().min(1, 'University name is required').max(200, 'Name must be 200 characters or less'),
    shortName: z.string().trim().min(1, 'Short name is required').max(20, 'Short name must be 20 characters or less'),
})

export const updateUniversitySchema = z.object({
    id: z.string().trim().min(1, 'Invalid request'),
    name: z.string().trim().min(1, 'University name is required').max(200, 'Name must be 200 characters or less'),
    shortName: z.string().trim().min(1, 'Short name is required').max(20, 'Short name must be 20 characters or less'),
})

export const deleteUniversitySchema = z.object({
    id: z.string().trim().min(1, 'Invalid request'),
})
