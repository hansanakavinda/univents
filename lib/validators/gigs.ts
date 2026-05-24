import { z } from 'zod'

const baseGigSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
    description: z.string().trim().min(1, 'Description is required').max(5000, 'Description must be 5000 characters or less'),
    imagePath: z.string().trim().nullable().optional(),
    priceType: z.enum(['FIXED', 'RANGE', 'NEGOTIABLE']),
    minPrice: z.coerce.number().min(0, 'Price must be 0 or greater').nullable().optional(),
    maxPrice: z.coerce.number().min(0, 'Price must be 0 or greater').nullable().optional(),
    contactNo: z.string().trim().min(1, 'Contact number is required').max(50, 'Contact number must be 50 characters or less'),
    categoryId: z.string().trim().min(1, 'Category is required'),
    uniId: z.string().trim().min(1, 'University is required'),
    discardedImageIds: z.array(z.string()).optional(),
})

export const createGigSchema = baseGigSchema.superRefine((data, ctx) => {
    if (data.priceType === 'FIXED') {
        if (data.minPrice === null || data.minPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Price is required for fixed price gigs',
                path: ['minPrice'],
            })
        }
    } else if (data.priceType === 'RANGE') {
        if (data.minPrice === null || data.minPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Minimum price is required for range price gigs',
                path: ['minPrice'],
            })
        }
        if (data.maxPrice === null || data.maxPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Maximum price is required for range price gigs',
                path: ['maxPrice'],
            })
        }
        if (data.minPrice !== null && data.minPrice !== undefined && data.maxPrice !== null && data.maxPrice !== undefined) {
            if (data.maxPrice < data.minPrice) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Maximum price must be greater than or equal to minimum price',
                    path: ['maxPrice'],
                })
            }
        }
    }
})

export const updateGigSchema = baseGigSchema.extend({
    gigId: z.string().min(1, 'Gig ID is required'),
}).superRefine((data, ctx) => {
    if (data.priceType === 'FIXED') {
        if (data.minPrice === null || data.minPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Price is required for fixed price gigs',
                path: ['minPrice'],
            })
        }
    } else if (data.priceType === 'RANGE') {
        if (data.minPrice === null || data.minPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Minimum price is required for range price gigs',
                path: ['minPrice'],
            })
        }
        if (data.maxPrice === null || data.maxPrice === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Maximum price is required for range price gigs',
                path: ['maxPrice'],
            })
        }
        if (data.minPrice !== null && data.minPrice !== undefined && data.maxPrice !== null && data.maxPrice !== undefined) {
            if (data.maxPrice < data.minPrice) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Maximum price must be greater than or equal to minimum price',
                    path: ['maxPrice'],
                })
            }
        }
    }
})

export const moderateGigSchema = z.object({
    gigId: z.string().min(1, 'Gig ID is required'),
    action: z.enum(['approve', 'reject']),
})

export const deleteGigSchema = z.object({
    gigId: z.string().min(1, 'Gig ID is required'),
})
