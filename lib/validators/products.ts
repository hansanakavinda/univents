import { z } from 'zod'

const baseProductSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
    description: z.string().trim().min(1, 'Description is required').max(5000, 'Description must be 5000 characters or less'),
    imagePath: z.string().trim().nullable().optional(),
    priceType: z.enum(['FIXED', 'NEGOTIABLE']),
    price: z.coerce.number().min(0, 'Price must be 0 or greater').nullable().optional(),
    contactNo: z.string().trim().min(1, 'Contact number is required').max(50, 'Contact number must be 50 characters or less'),
    categoryId: z.string().trim().min(1, 'Category is required'),
    uniId: z.string().trim().min(1, 'University is required'),
    discardedImageIds: z.array(z.string()).optional(),
})

export const createProductSchema = baseProductSchema.superRefine((data, ctx) => {
    if (data.priceType === 'FIXED') {
        if (data.price === null || data.price === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Price is required for fixed price products',
                path: ['price'],
            })
        }
    }
})

export const updateProductSchema = baseProductSchema.extend({
    productId: z.string().min(1, 'Product ID is required'),
}).superRefine((data, ctx) => {
    if (data.priceType === 'FIXED') {
        if (data.price === null || data.price === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Price is required for fixed price products',
                path: ['price'],
            })
        }
    }
})

export const moderateProductSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    action: z.enum(['approve', 'reject']),
})

export const deleteProductSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
})
