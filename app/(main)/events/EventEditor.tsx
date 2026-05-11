'use client'

import { useState, useRef, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
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
    endDate: string | Date
    eventTime?: string | null
    venue?: string | null
    uniId: string
}

interface EventEditorProps {
    universities: University[]
    defaultOpen?: boolean
    /** If provided, the editor opens in "edit" mode with pre-filled values */
    eventData?: EventData
    /** Custom trigger button — when provided, the default button is not rendered */
    trigger?: React.ReactNode
    onOpenChange?: (open: boolean) => void
}

export function EventEditor({ universities, defaultOpen = false, eventData, trigger, onOpenChange }: EventEditorProps) {
    const router = useRouter()
    const toast = useToast()
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const isEditMode = !!eventData

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imagePath, setImagePath] = useState('')
    const [endDate, setEndDate] = useState('')
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
            setEndDate(
                typeof eventData.endDate === 'string'
                    ? eventData.endDate.split('T')[0]
                    : eventData.endDate.toISOString().split('T')[0]
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

    const resetForm = () => {
        if (!isEditMode) {
            setTitle('')
            setContent('')
            setImagePath('')
            setEndDate('')
            setEventTime('')
            setVenue('')
            setUniId('')
        }
        setError('')
        discardedImageIds.current = []
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        onOpenChange?.(open)
        if (!open) {
            setError('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!title.trim() || !content.trim() || !endDate || !uniId) {
            setError('Please fill in all required fields')
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
                endDate,
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
                resetForm()
                handleOpenChange(false)
                router.refresh()
                toast.info(
                    isEditMode
                        ? 'Event updated! It will be reviewed again by moderators.'
                        : 'Event submitted for review! An admin will approve it soon.'
                )
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
        <>
            {trigger ? (
                <div onClick={() => handleOpenChange(true)}>{trigger}</div>
            ) : (
                <Button variant="primary" onClick={() => handleOpenChange(true)} className='whitespace-nowrap'>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
                </Button>
            )}

            <Modal
                isOpen={isOpen}
                onClose={() => handleOpenChange(false)}
                title={isEditMode ? 'Edit Event' : 'Create New Event'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        rows={4}
                        maxLength={5000}
                    />

                    <ImageUpload
                        value={imagePath}
                        onChange={(url) => setImagePath(url)}
                        onDiscard={(id) => discardedImageIds.current.push(id)}
                        disabled={isLoading}
                    />

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

                    <Input
                        label="Event Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <Select
                        label="University"
                        placeholder="Select university"
                        options={universityOptions}
                        value={uniId}
                        onChange={(e) => setUniId(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <div className="flex items-center space-x-3 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading
                                ? 'Submitting...'
                                : 'Submit for Review'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
