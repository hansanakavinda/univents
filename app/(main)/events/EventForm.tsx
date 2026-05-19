'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'

interface University {
    id: string
    name: string
    shortName: string
}

export interface EventData {
    id: string
    title: string
    content: string
    imagePath: string | null
    endDate: string | Date | null
    isComingSoon?: boolean
    eventTime?: string | null
    venue?: string | null
    uniId: string
}

interface EventFormProps {
    universities: University[]
    eventData?: EventData
    onSuccess?: () => void
    onCancel?: () => void
}

export function EventForm({ universities, eventData, onSuccess, onCancel }: EventFormProps) {
    const router = useRouter()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const isEditMode = !!eventData

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imagePath, setImagePath] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isComingSoon, setIsComingSoon] = useState(false)
    const [eventTime, setEventTime] = useState('')
    const [venue, setVenue] = useState('')
    const [uniId, setUniId] = useState('')
    const discardedImageIds = useRef<string[]>([])

    // Pre-fill form when editing
    useEffect(() => {
        if (eventData) {
            setTitle(eventData.title)
            setContent(eventData.content)
            setImagePath(eventData.imagePath || '')
            setIsComingSoon(eventData.isComingSoon ?? false)
            setEndDate(
                eventData.endDate
                    ? (typeof eventData.endDate === 'string'
                        ? eventData.endDate.split('T')[0]
                        : eventData.endDate.toISOString().split('T')[0])
                    : ''
            )
            setEventTime(eventData.eventTime || '')
            setVenue(eventData.venue || '')
            setUniId(eventData.uniId)
        }
    }, [eventData])

    const universityOptions = universities.map((uni) => ({
        value: uni.id,
        label: `${uni.name} (${uni.shortName})`,
    }))

    const handleComingSoonToggle = (checked: boolean) => {
        setIsComingSoon(checked)
        if (checked) {
            setEndDate('') // Clear date when marking as coming soon
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!title.trim() || !content.trim() || !uniId) {
            setError('Please fill in all required fields')
            return
        }

        if (!isComingSoon && !endDate) {
            setError('Please provide an event date or mark it as Coming Soon')
            return
        }

        setIsLoading(true)
        try {
            const url = isEditMode ? '/api/events/update' : '/api/events/create'
            const method = isEditMode ? 'PUT' : 'POST'

            const body: Record<string, unknown> = {
                title,
                content,
                imagePath,
                endDate: isComingSoon ? undefined : endDate,
                isComingSoon,
                eventTime: eventTime || undefined,
                venue: venue || undefined,
                uniId,
                discardedImageIds: discardedImageIds.current,
            }

            if (isEditMode && eventData) {
                body.eventId = eventData.id
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (response.ok) {
                toast.info(
                    isEditMode
                        ? 'Event updated! It will be reviewed again by moderators.'
                        : 'Event submitted for review! An admin will approve it soon.'
                )
                router.refresh()
                if (onSuccess) onSuccess()
            } else {
                const data = await response.json()
                toast.error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} event`)
            }
        } catch (err) {
            setError(`An unexpected error occurred: ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto w-full bg-card p-6 md:p-8 rounded-2xl border border-border">
            {error && (
                <div className="p-3 rounded-xl bg-red-900/30 border border-red-800/30">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-800/30">
                <p className="text-sm text-blue-400">
                    {isEditMode
                        ? 'Editing your event will require re-approval by moderators.'
                        : 'Your event will be reviewed by moderators before appearing publicly.'}
                </p>
            </div>

            <Input
                label="Event Title"
                placeholder="Enter event title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
                maxLength={200}
            />

            <Textarea
                label="Description"
                placeholder="Describe the event..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={isLoading}
                rows={6}
                maxLength={5000}
            />

            <ImageUpload
                value={imagePath}
                onChange={(url) => setImagePath(url)}
                onDiscard={(id) => discardedImageIds.current.push(id)}
                disabled={isLoading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Event Time"
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    disabled={isLoading}
                />

                <Input
                    label="Venue"
                    placeholder="e.g. Main Auditorium, UCSC"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    disabled={isLoading}
                    maxLength={300}
                />
            </div>

            {/* Coming Soon toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none group">
                <div className="relative">
                    <input
                        id="isComingSoon"
                        type="checkbox"
                        className="sr-only peer"
                        checked={isComingSoon}
                        onChange={(e) => handleComingSoonToggle(e.target.checked)}
                        disabled={isLoading}
                    />
                    <div className="w-10 h-6 bg-surface border border-border rounded-full peer-checked:bg-primary transition-colors duration-200" />
                    <div className="absolute top-1 left-1 w-4 h-4 bg-text-dim rounded-full transition-all duration-200 peer-checked:translate-x-4 peer-checked:bg-white" />
                </div>
                <span className="text-sm text-text-primary group-hover:text-white transition-colors">
                    Date not confirmed yet <span className="text-accent font-medium">(Coming Soon)</span>
                </span>
            </label>

            {/* Event Date — hidden when Coming Soon */}
            {!isComingSoon && (
                <Input
                    label="Event Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    disabled={isLoading}
                />
            )}

            <Select
                label="University"
                placeholder="Select university"
                options={universityOptions}
                value={uniId}
                onChange={(e) => setUniId(e.target.value)}
                required
                disabled={isLoading}
            />

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border mt-6">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="w-full sm:flex-1"
                >
                    {isLoading
                        ? 'Submitting...'
                        : 'Submit for Review'}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="w-full sm:flex-1"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    )
}
