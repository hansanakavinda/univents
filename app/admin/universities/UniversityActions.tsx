'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { ApiClient } from '@/lib/api/api-client'

interface University {
    id: string
    name: string
    shortName: string
}

interface UniversityActionsProps {
    university: University
}

export function UniversityActions({ university }: UniversityActionsProps) {
    const router = useRouter()
    const toast = useToast()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState(university.name)
    const [shortName, setShortName] = useState(university.shortName)

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !shortName.trim()) return

        setIsLoading(true)
        try {
            const result = await ApiClient.put('/api/admin/universities/update', {
                id: university.id,
                name,
                shortName,
            })

            if (result.ok) {
                setIsEditOpen(false)
                router.refresh()
                toast.success('University updated successfully')
            } else {
                toast.error(result.error || 'Failed to update university')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${university.name}"? This action cannot be undone.`)) {
            return
        }

        setIsLoading(true)
        try {
            const result = await ApiClient.post('/api/admin/universities/delete', {
                id: university.id,
            })

            if (result.ok) {
                router.refresh()
                toast.success('University deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete university')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="flex items-center space-x-2">
                <Button
                    variant="ghost"
                    onClick={() => setIsEditOpen(true)}
                    disabled={isLoading}
                >
                    ✏️ Edit
                </Button>
                <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isLoading}
                >
                    🗑️ Delete
                </Button>
            </div>

            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit University"
                size="sm"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                        label="University Name"
                        placeholder="e.g. University of Colombo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        maxLength={200}
                    />

                    <Input
                        label="Short Name"
                        placeholder="e.g. UoC"
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value)}
                        required
                        disabled={isLoading}
                        maxLength={20}
                    />

                    <div className="flex items-center space-x-3 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsEditOpen(false)}
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

export function AddUniversityButton() {
    const router = useRouter()
    const toast = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [shortName, setShortName] = useState('')

    const resetForm = () => {
        setName('')
        setShortName('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !shortName.trim()) return

        setIsLoading(true)
        try {
            const result = await ApiClient.post('/api/admin/universities/create', {
                name,
                shortName,
            })

            if (result.ok) {
                resetForm()
                setIsOpen(false)
                router.refresh()
                toast.success('University created successfully')
            } else {
                toast.error(result.error || 'Failed to create university')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button variant="primary" onClick={() => setIsOpen(true)}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add University
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false)
                    resetForm()
                }}
                title="Add New University"
                size="sm"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="University Name"
                        placeholder="e.g. University of Colombo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        maxLength={200}
                    />

                    <Input
                        label="Short Name"
                        placeholder="e.g. UoC"
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value)}
                        required
                        disabled={isLoading}
                        maxLength={20}
                    />

                    <div className="flex items-center space-x-3 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? 'Creating...' : 'Create University'}
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
