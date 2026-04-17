import { getEventById } from '@/data-access/events'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate, formatTime, formatDateToLong } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { LikeButton } from '@/components/ui/LikeButton'
import { ShareButton } from '@/components/ui/ShareButton'
import getSession from '@/lib/getSession'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

// SEO: Generate unique metadata for each event page.
// Google uses this for search result titles, descriptions, and social sharing previews.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const event = await getEventById(id)

    if (!event) {
        return { title: 'Event Not Found' }
    }

    // Truncate description to 160 chars for SEO best practice
    const description = event.content.length > 160
        ? event.content.slice(0, 157) + '...'
        : event.content

    return {
        title: event.title,
        description,
        openGraph: {
            title: `${event.title} | Univents`,
            description,
            type: 'article',
            ...(event.imagePath && {
                images: [
                    {
                        url: event.imagePath,
                        alt: event.title,
                    },
                ],
            }),
        },
    }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await getEventById(id)

    if (!event) {
        notFound()
    }

    // Fetch session to determine like state for the current user
    const session = await getSession()
    const currentUserId = session?.user?.id
    let isLikedByUser = false
    if (currentUserId) {
        const like = await prisma.eventLike.findUnique({
            where: { eventId_userId: { eventId: event.id, userId: currentUserId } },
        })
        isLikedByUser = !!like
    }

    // SEO: Schema.org/Event structured data for Google Rich Snippets.
    // Enables event-specific search features like date, location, and price display.
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        description: event.content.length > 300
            ? event.content.slice(0, 297) + '...'
            : event.content,
        startDate: new Date(event.endDate).toISOString(),
        endDate: new Date(event.endDate).toISOString(),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        ...(event.imagePath && { image: event.imagePath }),
        location: {
            '@type': 'Place',
            name: event.venue || event.university.name,
            ...(event.venue && {
                address: event.venue,
            }),
        },
        organizer: {
            '@type': 'Organization',
            name: event.university.name,
        },
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
            url: `${process.env.NEXTAUTH_URL || 'https://univents.com.lk'}/events/${event.id}`,
        },
    }

    return (
        <>
            {/* SEO: JSON-LD injected as a script tag — invisible to users, read by search engine crawlers */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen">
                <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
                    {/* Back navigation */}
                    <Link
                        href="/events"
                        className="inline-flex items-center text-sm text-accent hover:text-accent-hover font-medium mb-6 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Events
                    </Link>

                    <article className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                        {/* Event Image */}
                        {event.imagePath && (
                            <div className="w-full flex items-center justify-center bg-card-disabled">
                                <Image
                                    src={event.imagePath}
                                    alt={event.title}
                                    className="w-full h-auto max-h-[60vh] object-contain"
                                    width={1080}
                                    height={1920}
                                    priority
                                />
                            </div>
                        )}

                        <div className="p-6 md:p-8">
                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {event.title}
                            </h1>

                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-text-muted">
                                <Badge variant="default">{event.university.shortName}</Badge>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {event.author.name || 'Anonymous'}
                                </span>
                            </div>

                            {/* Event Details Compact Box */}
                            <div className="bg-accent/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-accent/20 flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 shadow-sm w-fit max-w-full">
                                <div className="flex items-center gap-2 shrink-0">
                                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-white text-sm font-medium">{formatDateToLong(event.endDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-white text-sm font-medium">{event.eventTime ? formatTime(event.eventTime) : 'TBA'}</span>
                                </div>
                                <div className="flex items-center gap-2 min-w-0">
                                    <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-white text-sm font-medium line-clamp-1 break-words">{event.venue || event.university.name}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="prose prose-invert max-w-none">
                                <p className="text-text-primary whitespace-pre-wrap leading-relaxed text-base">
                                    {event.content}
                                </p>
                            </div>

                            {/* Footer with Like Button and Share Button */}
                            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <LikeButton
                                        eventId={event.id}
                                        initialLikeCount={event._count.likes}
                                        initialIsLiked={isLikedByUser}
                                        currentUserId={currentUserId}
                                    />
                                    <ShareButton eventId={event.id} title={event.title} />
                                </div>
                                <p className="text-xs text-text-dim">
                                    Posted <time dateTime={new Date(event.createdAt).toISOString()}>{formatDate(event.createdAt)}</time>
                                </p>
                            </div>
                        </div>
                    </article>
                </main>
            </div>
        </>
    )
}
