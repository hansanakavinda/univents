
import { getApprovedEventsPaginated } from '@/data-access/events'
import { getAllUniversities } from '@/data-access/universities'
import { EventsList } from './EventsList'
import getSession from '@/lib/getSession'
import { EVENTS_PER_PAGE_AUTHENTICATED, EVENTS_PER_PAGE_GUEST } from '@/lib/constants'
import type { Metadata } from 'next'
import Link from 'next/link'

// SEO: Static metadata for the events listing page.
// Uses the title template from root layout → "Upcoming University Events | Univents"
export const metadata: Metadata = {
    title: 'University Events Sri Lanka',
    description:
        'Browse the best upcoming university events across Sri Lanka. Find the latest campus activities, hackathons, and undergraduate workshops on Univents.',
    openGraph: {
        title: 'University Events Sri Lanka | Univents',
        description:
            'Browse the best upcoming university events across Sri Lanka. Find the latest campus activities, hackathons, and undergraduate workshops on Univents.',
    },
    alternates: {
        canonical: 'https://univents.com.lk/events', // The "Master" URL
    },
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ create?: string }> }) {
    const session = await getSession()
    const isAuthenticated = !!session
    const userId = session?.user?.id
    const initialEvents = await getApprovedEventsPaginated({ take: isAuthenticated ? EVENTS_PER_PAGE_AUTHENTICATED : EVENTS_PER_PAGE_GUEST, skip: 0, userId })
    const universities = await getAllUniversities()

    return (
        <div className="px-4 md:p-6 max-w-7xl mx-auto space-y-6">
            {/* SEO: <header> for the page heading area improves document structure for crawlers */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-6 border-b border-border/40">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                        University <span className="text-primary">Events</span> & Activities
                    </h1>
                    <p className="text-text-muted text-sm max-w-xl">
                        Discover upcoming campus events, hackathons, workshops, and student meetups across Sri Lanka.
                    </p>
                </div>
                {isAuthenticated && (
                    <div className="flex justify-center shrink-0">
                        <Link
                            href="/events/create"
                            className="group inline-flex items-center px-5 py-3 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-white/10 hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Share an Event
                        </Link>
                    </div>
                )}
            </header>

            {/* SEO: <section> with aria-label identifies the events list for screen readers and crawlers */}
            <section aria-label="University events" className="w-full">
                <EventsList initialEvents={initialEvents} currentUserId={userId} universities={universities} isAuthenticated={isAuthenticated} />
            </section>
        </div>
    )
}

