'use client'

import { useRouter } from 'next/navigation'
import { EventForm } from '../EventForm'

interface University {
    id: string
    name: string
    shortName: string
}

export function CreateEventClient({ universities }: { universities: University[] }) {
    const router = useRouter()

    return (
        <EventForm 
            universities={universities} 
            onSuccess={() => router.push('/events')}
            onCancel={() => router.push('/events')}
        />
    )
}
