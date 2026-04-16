import { Sidebar } from '@/components/Sidebar'
import { getApprovedEventsPaginated } from '@/data-access/events'
import { getAllUniversities } from '@/data-access/universities'
import { EventEditor } from './EventEditor'
import { EventsList } from './EventsList'
import getSession from '@/lib/getSession'
import type { Metadata } from 'next'

// SEO: Static metadata for the events listing page.
// Uses the title template from root layout → "Upcoming University Events | Univents"
export const metadata: Metadata = {
    description:
        'Browse upcoming university events across Sri Lanka. Find campus activities, workshops, cultural shows, and more on Univents.',
    openGraph: {
        title: 'Univents',
        description:
            'Browse upcoming university events across Sri Lanka. Find campus activities, workshops, cultural shows, and more.',
    },
    alternates: {
        canonical: 'https://univents.com.lk/events', // The "Master" URL
    },
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ create?: string }> }) {
    const session = await getSession()
    const params = await searchParams
    const shouldOpenEditor = params.create === 'true'

    const isAuthenticated = !!session
    const userId = session?.user?.id
    const initialEvents = await getApprovedEventsPaginated({ take: isAuthenticated ? 4 : 2, skip: 0, userId })
    const universities = await getAllUniversities()

    return (
        <div className="flex min-h-screen">
            {session && (
                <Sidebar
                    userRole={session.user?.role || 'USER'}
                    userName={session.user?.name || 'User'}
                    userEmail={session.user?.email || ''}
                />
            )}
            <main className={`flex-1 w-full max-w-full overflow-hidden md:p-6 ${session ? 'md:ml-64 pt-20 md:pt-8' : ''}`}>
                {/* SEO: <header> for the page heading area improves document structure for crawlers */}
                <header className="max-w-4xl mx-auto mb-4 mt-4">
                    <div className="flex flex-col items-center justify-center md:flex-row md:items-center md:justify-between gap-6 mb-4">
                        <div className='flex flex-col items-center justify-center md:items-start md:justify-start'>
                            <h1 className="text-4xl font-bold text-white mb-2">Univents</h1>
                            <p className="text-text-muted text-center md:text-left">Discover and share amazing events</p>
                        </div>
                        {session && <div className='flex flex-wrap gap-4 items-center justify-center'>
                            <EventEditor universities={universities} defaultOpen={shouldOpenEditor} />
                        </div>}

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
            </main>
        </div>
    )
}

