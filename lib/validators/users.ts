import { z } from 'zod'

export const updateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    uniId: z.string().optional().nullable(),
})
