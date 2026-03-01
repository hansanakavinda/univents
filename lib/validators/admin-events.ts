import { z } from 'zod'
export const moderateEventSchema = z.object({
    eventId: z.string().trim().min(1, 'Invalid request'),
    action: z.enum(['approve', 'reject']),
})
