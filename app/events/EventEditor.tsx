'use client'

import { useState, useRef } from 'react'
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

interface EventEditorProps {
    universities: University[]
    defaultOpen?: boolean
}

export function EventEditor({ universities, defaultOpen = false }: EventEditorProps) {
    const router = useRouter()
    const toast = useToast()
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imagePath, setImagePath] = useState('')
    const [endDate, setEndDate] = useState('')
    const [uniId, setUniId] = useState('')
    const discardedImageIds = useRef<string[]>([])

    const universityOptions = universities.map((uni) => ({
        value: uni.id,
        label: `${uni.name} (${uni.shortName})`,
    }))

    const resetForm = () => {
        setTitle('')
        setContent('')
        setImagePath('')
        setEndDate('')
        setUniId('')
        setError('')
        discardedImageIds.current = []
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
            const response = await fetch('/api/events/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    imagePath,
                    endDate,
                    uniId,
                    discardedImageIds: discardedImageIds.current,
                }),
            })

            if (response.ok) {
                resetForm()
                setIsOpen(false)
                router.refresh()
                toast.info('Event submitted for review! An admin will approve it soon.')
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to create event')
            }
        } catch (err) {
            setError(`An unexpected error occurred: ${err}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button variant="primary" onClick={() => setIsOpen(true)} className='whitespace-nowrap'>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Event
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false)
                    setError('')
                }}
                title="Create New Event"
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <p className="text-sm text-blue-800">
                            Your event will be reviewed by moderators before appearing publicly.
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
                        label="Event End Date"
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
                            {isLoading ? 'Submitting...' : 'Submit for Review'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
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
