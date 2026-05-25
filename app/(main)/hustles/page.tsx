import { getAllHustleCategories } from '@/data-access/hustle-categories'
import { getApprovedHustlesPaginated } from '@/data-access/hustles'
import { HustlesList } from './HustlesList'
import getSession from '@/lib/getSession'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Student Side Hustles & Internships | Univents',
    description:
        'Find freelance work, part-time jobs, internships, and one-time tasks across universities in Sri Lanka.',
    openGraph: {
        title: 'Student Side Hustles & Internships | Univents',
        description:
            'Find freelance work, part-time jobs, internships, and one-time tasks across universities in Sri Lanka.',
    },
    alternates: {
        canonical: 'https://univents.com.lk/hustles',
    },
}

export default async function HustlesPage() {
    const session = await getSession()
    const isAuthenticated = !!session

    // Fetch initial approved hustles and categories on server
    const initialHustles = await getApprovedHustlesPaginated({ take: 8, skip: 0 })
    const categories = await getAllHustleCategories()

    return (
        <div className="px-4 md:p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-6 border-b border-border/40">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                        Student <span className="text-primary">Hustles</span> & Jobs
                    </h1>
                    <p className="text-text-muted text-sm max-w-xl">
                        Find part-time work, freelance gigs, internships, and one-time tasks to earn money and gain experience while studying.
                    </p>
                </div>
                {isAuthenticated && (
                    <div className="flex justify-center shrink-0">
                        <Link
                            href="/hustles/create"
                            className="group inline-flex items-center px-5 py-3 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-white/10 hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Post a Hustle
                        </Link>
                    </div>
                )}
            </header>

            <section aria-label="Student hustles opportunities" className="w-full">
                <HustlesList
                    initialHustles={JSON.parse(JSON.stringify(initialHustles))}
                    categories={JSON.parse(JSON.stringify(categories))}
                />
            </section>
        </div>
    )
}
