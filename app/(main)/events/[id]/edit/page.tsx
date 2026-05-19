import { getAllUniversities } from '@/data-access/universities'
import { getEventById } from '@/data-access/events'
import getSession from '@/lib/getSession'
import { redirect, notFound } from 'next/navigation'
import { EditEventClient } from './EditEventClient'

export const dynamic = 'force-dynamic'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getSession()
    
    if (!session) {
        redirect('/login')
    }

    const event = await getEventById(id)
    if (!event) {
        notFound()
    }

    // Basic authorization check: user must be the author or an admin
    if (event.authorId !== session.user?.id && session.user?.role !== 'ADMIN' && session.user?.role !== 'SUPER_ADMIN') {
        redirect('/events')
    }

    const universities = await getAllUniversities()

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Edit Event</h1>
                <p className="text-text-muted">Update details for your event. Note that edits will require moderator approval again.</p>
            </div>
            
            <EditEventClient universities={universities} event={event} />
        </div>
    )
}
