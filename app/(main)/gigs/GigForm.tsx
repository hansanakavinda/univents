'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'
import { ApiClient } from '@/lib/api/api-client'

interface University {
    id: string
    name: string
    shortName: string
}

interface Category {
    id: string
    name: string
}

export interface GigData {
    id: string
    title: string
    description: string
    imagePath: string | null
    priceType: string
    minPrice: number | null
    maxPrice: number | null
    contactNo: string
    categoryId: string
    uniId: string
}

interface GigFormProps {
    universities: University[]
    categories: Category[]
    gigData?: GigData
    onSuccess?: () => void
    onCancel?: () => void
}

export function GigForm({ universities, categories, gigData, onSuccess, onCancel }: GigFormProps) {
    const router = useRouter()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const isEditMode = !!gigData

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imagePath, setImagePath] = useState('')
    const [priceType, setPriceType] = useState('FIXED')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [contactNo, setContactNo] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [uniId, setUniId] = useState('')
    const discardedImageIds = useRef<string[]>([])

    // Pre-fill form when editing
    useEffect(() => {
        if (gigData) {
            setTitle(gigData.title)
            setDescription(gigData.description)
            setImagePath(gigData.imagePath || '')
            setPriceType(gigData.priceType)
            setMinPrice(gigData.minPrice !== null ? String(gigData.minPrice) : '')
            setMaxPrice(gigData.maxPrice !== null ? String(gigData.maxPrice) : '')
            setContactNo(gigData.contactNo)
            setCategoryId(gigData.categoryId)
            setUniId(gigData.uniId)
        }
    }, [gigData])

    const universityOptions = universities.map((uni) => ({
        value: uni.id,
        label: `${uni.name} (${uni.shortName})`,
    }))

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }))

    const priceTypeOptions = [
        { value: 'FIXED', label: 'Fixed Price' },
        { value: 'RANGE', label: 'Price Range' },
        { value: 'NEGOTIABLE', label: 'Negotiable' },
    ]

    const handleImageChange = (url: string) => {
        setImagePath(url)
    }

    const handleImageDiscard = (publicId: string) => {
        discardedImageIds.current.push(publicId)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!title.trim() || !description.trim() || !contactNo.trim() || !categoryId || !uniId) {
            setError('Please fill in all required fields')
            return
        }

        if (priceType === 'FIXED' && !minPrice) {
            setError('Please provide a price')
            return
        }

        if (priceType === 'RANGE' && (!minPrice || !maxPrice)) {
            setError('Please provide both minimum and maximum prices')
            return
        }

        if (priceType === 'RANGE' && Number(maxPrice) < Number(minPrice)) {
            setError('Maximum price must be greater than or equal to minimum price')
            return
        }

        setIsLoading(true)

        const payload = {
            title,
            description,
            imagePath: imagePath || null,
            priceType,
            minPrice: minPrice ? Number(minPrice) : null,
            maxPrice: maxPrice ? Number(maxPrice) : null,
            contactNo,
            categoryId,
            uniId,
            discardedImageIds: discardedImageIds.current,
        }

        try {
            const endpoint = isEditMode ? '/api/gigs/update' : '/api/gigs/create'
            const body = isEditMode ? { ...payload, gigId: gigData.id } : payload

            const result = await ApiClient.post(endpoint, body)

            if (result.ok) {
                toast.success(isEditMode ? 'Gig updated successfully! Awaiting approval.' : 'Gig created successfully! Awaiting approval.')
                discardedImageIds.current = [] // clear on success
                if (onSuccess) {
                    onSuccess()
                } else {
                    router.push('/dashboard')
                    router.refresh()
                }
            } else {
                setError(result.error || 'Something went wrong')
            }
        } catch {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-card p-6 rounded-2xl border border-border">
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    ⚠️ {error}
                </div>
            )}

            <div className="space-y-4">
                <Input
                    label="Gig Title"
                    placeholder="e.g. Professional UI/UX Design, Math Tutoring"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <Textarea
                    label="Gig Description"
                    placeholder="Describe your skills, what service you offer, what's included, and any requirements..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    disabled={isLoading}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Category"
                        placeholder="Select Category"
                        options={categoryOptions}
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <Select
                        label="University Location"
                        placeholder="Select University"
                        options={universityOptions}
                        value={uniId}
                        onChange={(e) => setUniId(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <Select
                        label="Price Type"
                        options={priceTypeOptions}
                        value={priceType}
                        onChange={(e) => {
                            setPriceType(e.target.value)
                            if (e.target.value === 'NEGOTIABLE') {
                                setMinPrice('')
                                setMaxPrice('')
                            }
                        }}
                        required
                        disabled={isLoading}
                    />

                    {priceType !== 'NEGOTIABLE' && (
                        <Input
                            label={priceType === 'FIXED' ? 'Price (LKR)' : 'Min Price (LKR)'}
                            type="number"
                            placeholder="e.g. 1500"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            required
                            disabled={isLoading}
                            min={0}
                        />
                    )}

                    {priceType === 'RANGE' && (
                        <Input
                            label="Max Price (LKR)"
                            type="number"
                            placeholder="e.g. 5000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            required
                            disabled={isLoading}
                            min={0}
                        />
                    )}
                </div>

                <Input
                    label="Contact Number"
                    placeholder="e.g. 0771234567 or WhatsApp link"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <ImageUpload
                    label="Cover / Portfolio Image"
                    value={imagePath}
                    onChange={handleImageChange}
                    onDiscard={handleImageDiscard}
                    disabled={isLoading}
                />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="px-8"
                >
                    {isLoading ? 'Submitting...' : isEditMode ? 'Save Changes' : 'Post Gig'}
                </Button>
            </div>
        </form>
    )
}
