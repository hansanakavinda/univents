import { z } from 'zod'

const baseHustleSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
    description: z.string().trim().min(1, 'Description is required').max(5000, 'Description must be 5000 characters or less'),
    imagePath: z.string().trim().nullable().optional(),
    hustleType: z.enum(['INTERNSHIP', 'FREELANCE', 'PART_TIME', 'ONE_TIME']),
    workMode: z.enum(['REMOTE', 'ON_SITE', 'HYBRID']),
    priceType: z.enum(['FIXED', 'RANGE']).nullable().optional(),
    minPrice: z.coerce.number().min(0, 'Salary must be 0 or greater').nullable().optional(),
    maxPrice: z.coerce.number().min(0, 'Salary must be 0 or greater').nullable().optional(),
    contactNo: z.string().trim().max(100, 'Contact detail must be 100 characters or less').nullable().optional(),
    categoryId: z.string().trim().min(1, 'Category is required'),
    discardedImageIds: z.array(z.string()).optional(),
})

export const createHustleSchema = baseHustleSchema.superRefine((data, ctx) => {
    if (data.priceType === 'FIXED') {
        if (data.minPrice === null || data.minPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Salary is required for fixed compensation',
                path: ['minPrice'],
            })
        }
    } else if (data.priceType === 'RANGE') {
        if (data.minPrice === null || data.minPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Minimum salary is required for range compensation',
                path: ['minPrice'],
            })
        }
        if (data.maxPrice === null || data.maxPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Maximum salary is required for range compensation',
                path: ['maxPrice'],
            })
        }
        if (data.minPrice !== null && data.minPrice !== undefined && data.maxPrice !== null && data.maxPrice !== undefined) {
            if (data.maxPrice < data.minPrice) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Maximum salary must be greater than or equal to minimum salary',
                    path: ['maxPrice'],
                })
            }
        }
    }
})

export const updateHustleSchema = baseHustleSchema.extend({
    hustleId: z.string().min(1, 'Hustle ID is required'),
}).superRefine((data, ctx) => {
    if (data.priceType === 'FIXED') {
        if (data.minPrice === null || data.minPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Salary is required for fixed compensation',
                path: ['minPrice'],
            })
        }
    } else if (data.priceType === 'RANGE') {
        if (data.minPrice === null || data.minPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Minimum salary is required for range compensation',
                path: ['minPrice'],
            })
        }
        if (data.maxPrice === null || data.maxPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Maximum salary is required for range compensation',
                path: ['maxPrice'],
            })
        }
        if (data.minPrice !== null && data.minPrice !== undefined && data.maxPrice !== null && data.maxPrice !== undefined) {
            if (data.maxPrice < data.minPrice) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Maximum salary must be greater than or equal to minimum salary',
                    path: ['maxPrice'],
                })
            }
        }
    }
})

export const moderateHustleSchema = z.object({
    hustleId: z.string().min(1, 'Hustle ID is required'),
    action: z.enum(['approve', 'reject']),
})

export const deleteHustleSchema = z.object({
    hustleId: z.string().min(1, 'Hustle ID is required'),
})
