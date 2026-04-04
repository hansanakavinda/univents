import { MetadataRoute } from 'next'
import { getAllApprovedEventIds } from '@/data-access/events'

const BASE_URL = process.env.NEXTAUTH_URL || 'https://univents.com.lk'

/**
 * SEO: Dynamic sitemap generation.
 * Queries the database for all approved events and generates a compliant sitemap.xml.
 * This helps search engines discover and index all event pages efficiently.
 * Accessible at /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const events = await getAllApprovedEventIds()

    const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
        url: `${BASE_URL}/events/${event.id}`,
        lastModified: event.updatedAt,
        changeFrequency: 'daily',
        priority: 0.8,
    }))

    return [
        {
            url: `${BASE_URL}/events`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...eventEntries,
    ]
}
