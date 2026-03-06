import cron from 'node-cron'
import { prisma } from '@/lib/prisma'
import { deleteImage } from '@/lib/cloudinary'

/**
 * Extract the Cloudinary public ID from a URL.
 * e.g. "https://res.cloudinary.com/xxx/image/upload/v123/univents/events/abc.jpg"
 *   → "univents/events/abc"
 */
function extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.*?)(?:\.\w+)?$/)
    return match?.[1] ?? null
}

/**
 * Delete events whose endDate is more than 24 hours in the past,
 * along with their Cloudinary images.
 */
async function cleanupExpiredEvents() {
    const now = new Date()
    console.log(`[cron] Starting expired events cleanup at ${now.toISOString()}`)

    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const expiredEvents = await prisma.event.findMany({
        where: { endDate: { lt: cutoff } },
        select: { id: true, title: true, imagePath: true },
    })

    if (expiredEvents.length === 0) {
        console.log('[cron] No expired events found.')
        return
    }

    console.log(`[cron] Found ${expiredEvents.length} expired event(s)`)

    // Delete Cloudinary images
    let imagesDeleted = 0
    for (const event of expiredEvents) {
        if (event.imagePath) {
            const publicId = extractPublicId(event.imagePath)
            if (publicId) {
                try {
                    await deleteImage(publicId)
                    imagesDeleted++
                    console.log(`[cron]   Deleted image for "${event.title}" (${publicId})`)
                } catch (err) {
                    console.error(`[cron]   Failed to delete image for "${event.title}":`, err)
                }
            }
        }
    }

    // Batch delete events (EventLike cascade-deletes automatically)
    const ids = expiredEvents.map(e => e.id)
    const { count } = await prisma.event.deleteMany({
        where: { id: { in: ids } },
    })

    console.log(`[cron] Done. Deleted ${count} event(s), ${imagesDeleted} image(s).`)
}

/**
 * Initialize all cron jobs. Call this once on server startup.
 */
export function initCronJobs() {
    // Run at midnight every day
    cron.schedule('0 0 * * *', () => {
        cleanupExpiredEvents().catch(err => {
            console.error('[cron] Cleanup failed:', err)
        })
    })

    console.log('[cron] Scheduled: expired events cleanup at midnight daily')
}
