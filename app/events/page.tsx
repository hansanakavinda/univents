import { Sidebar } from '@/components/Sidebar'
import { getApprovedEventsPaginated } from '@/data-access/events'
import { getAllUniversities } from '@/data-access/universities'
import { EventEditor } from './EventEditor'
import { EventsList } from './EventsList'
import getSession from '@/lib/getSession'

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ create?: string }> }) {
    const session = await getSession()
    const params = await searchParams
    const shouldOpenEditor = params.create === 'true'

    const isAuthenticated = !!session
    const userId = session?.user?.id
    const initialEvents = await getApprovedEventsPaginated({ take: isAuthenticated ? 4 : 2, skip: 0, userId })
    const universities = await getAllUniversities()

    return (
        <div className="flex min-h-screen bg-[#FCFAF7]">
            {session && (
                <Sidebar
                    userRole={session.user?.role || 'USER'}
                    userName={session.user?.name || 'User'}
                    userEmail={session.user?.email || ''}
                />
            )}
            <main className={`flex-1 w-full max-w-full overflow-hidden p-4 md:p-8 ${session ? 'md:ml-64 pt-20 md:pt-8' : ''}`}>
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex flex-col items-center justify-center md:flex-row md:items-center md:justify-between gap-6 mb-4">
                        <div className='flex flex-col items-center justify-center md:items-start md:justify-start'>
                            <h1 className="text-4xl font-bold text-[#4B3621] mb-2">Univents</h1>
                            <p className="text-gray-600 text-center md:text-left">Discover and share events happening across campuses</p>
                        </div>
                        {session && <div className='flex flex-wrap gap-4 items-center justify-center'>
                            <EventEditor universities={universities} defaultOpen={shouldOpenEditor} />
                        </div>}

                        {!session && (
                            <div className="p-3 md:p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <p className="text-sm text-blue-800">
                                    <a href="/login" className="font-semibold underline">Sign in</a>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Events Grid */}
                <div className="max-w-4xl mx-auto">
                    <EventsList initialEvents={initialEvents} currentUserId={userId} universities={universities} isAuthenticated={isAuthenticated} />
                </div>
            </main>
        </div>
    )
}
