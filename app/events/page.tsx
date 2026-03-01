import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/Sidebar'
import { getApprovedEventsPaginated } from '@/data-access/events'
import { EventEditor } from './EventEditor'
import { EventsList } from './EventsList'

export default async function EventsPage() {
    const session = await auth()

    // Fetch initial 4 events
    const initialEvents = await getApprovedEventsPaginated({ take: 4, skip: 0 })

    return (
        <div className="flex min-h-screen bg-[#FCFAF7]">
            <main className={`flex-1 p-8`}>
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-[#4B3621] mb-2">University Events</h1>
                            <p className="text-gray-600">Discover and share events happening across campuses</p>
                        </div>
                        {session && <div className='flex gap-4 items-center'>
                            <EventEditor />
                            <div className=" p-4 rounded-xl bg-blue-50 border border-blue-200 ">
                                <p className="text-sm text-blue-800">
                                    <a href="/dashboard" className="font-semibold underline">Dashboard</a>
                                </p>
                            </div>
                        </div>}

                        {!session && (
                            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <p className="text-sm text-blue-800">
                                    <a href="/login" className="font-semibold underline">Sign in</a>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Events Grid */}
                <div className="max-w-4xl mx-auto">
                    <EventsList initialEvents={initialEvents} />
                </div>
            </main>
        </div>
    )
}
