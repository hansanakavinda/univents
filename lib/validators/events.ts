import { z } from 'zod'

const baseEventSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
    content: z.string().trim().min(1, 'Description is required').max(5000, 'Description must be 5000 characters or less'),
    imagePath: z.string().trim().optional(),
    endDate: z.coerce.date().optional(),
    isComingSoon: z.boolean().optional().default(false),
    eventTime: z.string().trim().optional(),
    venue: z.string().trim().max(300, 'Venue must be 300 characters or less').optional(),
    uniId: z.string().trim().min(1, 'University is required'),
    discardedImageIds: z.array(z.string()).optional(),
})

export const createEventSchema = baseEventSchema.superRefine((data, ctx) => {
    if (!data.isComingSoon && !data.endDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Event date is required unless the event is marked as Coming Soon',
            path: ['endDate'],
        })
    }
})

export const updateEventSchema = baseEventSchema.extend({
    eventId: z.string().min(1, 'Event ID is required'),
}).superRefine((data, ctx) => {
    if (!data.isComingSoon && !data.endDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Event date is required unless the event is marked as Coming Soon',
            path: ['endDate'],
        })
    }
})

export const likeSchema = z.object({
    eventId: z.string().min(1, 'Event ID is required'),
})
