import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/Sidebar'
import { getApprovedEventsPaginated } from '@/data-access/events'
import { getAllUniversities } from '@/data-access/universities'
import { EventEditor } from './EventEditor'
import { EventsList } from './EventsList'

export default async function EventsPage() {
    const session = await auth()

    // Fetch initial 4 events
    const userId = session?.user?.id
    const initialEvents = await getApprovedEventsPaginated({ take: 4, skip: 0, userId })
    const universities = await getAllUniversities()

    return (
        <div className="flex min-h-screen bg-[#FCFAF7]">
            <main className={`flex-1 p-8`}>
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-[#4B3621] mb-2">Univents</h1>
                            <p className="text-gray-600">Discover and share events happening across campuses</p>
                        </div>
                        {session && <div className='flex flex-wrap gap-4 items-center'>
                            <EventEditor universities={universities} />
                            <div className="p-3 md:p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <p className="text-sm text-blue-800">
                                    <a href="/dashboard" className="font-semibold underline">Dashboard</a>
                                </p>
                            </div>
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
                    <EventsList initialEvents={initialEvents} currentUserId={userId} />
                </div>
            </main>
        </div>
    )
}
