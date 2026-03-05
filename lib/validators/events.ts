import { z } from 'zod'

export const createEventSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
    content: z.string().trim().min(1, 'Description is required').max(5000, 'Description must be 5000 characters or less'),
    imagePath: z.string().trim().optional(),
    endDate: z.coerce.date({ message: 'End date is required' }),
    uniId: z.string().trim().min(1, 'University is required'),
    discardedImageIds: z.array(z.string()).optional(),
})

export const likeSchema = z.object({
    eventId: z.string().min(1, 'Event ID is required'),
})
