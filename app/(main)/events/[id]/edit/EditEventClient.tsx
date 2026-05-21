'use client'

import { useRouter } from 'next/navigation'
import { EventForm, type EventData } from '../../EventForm'

interface University {
    id: string
    name: string
    shortName: string
}

// We map the backend event type to the EventData interface required by EventForm
export function EditEventClient({ universities, event }: { universities: University[], event: any }) {
    const router = useRouter()

    const eventData: EventData = {
        id: event.id,
        title: event.title,
        content: event.content,
        imagePath: event.imagePath,
        endDate: event.endDate,
        isComingSoon: event.isComingSoon,
        eventTime: event.eventTime,
        venue: event.venue,
        uniId: event.uniId,
    }

    return (
        <EventForm 
            universities={universities} 
            eventData={eventData}
            onSuccess={() => router.push(`/events/${event.id}`)}
            onCancel={() => router.back()}
        />
    )
}
