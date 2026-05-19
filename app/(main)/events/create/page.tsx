import { getAllUniversities } from '@/data-access/universities'
import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { CreateEventClient } from './CreateEventClient'

export const dynamic = 'force-dynamic'

export default async function CreateEventPage() {
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    const universities = await getAllUniversities()

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Create New Event</h1>
                <p className="text-text-muted">Share an upcoming event with the university community.</p>
            </div>
            
            <CreateEventClient universities={universities} />
        </div>
    )
}
