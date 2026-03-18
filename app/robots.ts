import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXTAUTH_URL || 'https://univents.com.lk'

/**
 * SEO: robots.txt configuration.
 * - Allows all crawlers to index public event pages
 * - Blocks private routes (admin, dashboard, API, login)
 * - Points to the dynamic sitemap for discovery
 * Accessible at /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/dashboard/', '/api/', '/login/'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
