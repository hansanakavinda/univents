
import { getApprovedEventsPaginated } from '@/data-access/events'
import { getAllUniversities } from '@/data-access/universities'
import { EventsList } from './EventsList'
import getSession from '@/lib/getSession'
import type { Metadata } from 'next'

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
    const initialEvents = await getApprovedEventsPaginated({ take: isAuthenticated ? 4 : 2, skip: 0, userId })
    const universities = await getAllUniversities()

    return (
        <>
            <div className="md:p-6">
                {/* SEO: <header> for the page heading area improves document structure for crawlers */}
                <header className="max-w-4xl mx-auto mb-4 mt-4">
                    <div className="flex flex-col items-center justify-center md:flex-row md:items-center md:justify-between gap-6 mb-4">
                        <div className='flex flex-col items-center justify-center md:items-start md:justify-start'>
                            <h1 className="text-primary text-center md:text-left text-3xl font-semibold">Your hub for University events in Sri Lanka</h1>
                        </div>

                        {!session && (
                            <div className="p-3 md:p-4 rounded-xl bg-surface border border-border">
                                <p className="text-sm text-accent">
                                    <a href="/login" className="font-semibold underline">Sign in</a>
                                </p>
                            </div>
                        )}
                    </div>
                </header>

                {/* SEO: <section> with aria-label identifies the events list for screen readers and crawlers */}
                <section aria-label="University events" className="max-w-4xl mx-2 sm:mx-auto ">
                    <EventsList initialEvents={initialEvents} currentUserId={userId} universities={universities} isAuthenticated={isAuthenticated} />
                </section>
            </div>
        </>
    )
}

