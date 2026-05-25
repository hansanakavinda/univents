'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'
import { ApiClient } from '@/lib/api/api-client'

interface Category {
    id: string
    name: string
}

export interface HustleData {
    id: string
    title: string
    description: string
    hustleType: string
    workMode: string
    priceType: string | null
    minPrice: number | null
    maxPrice: number | null
    contactNo: string | null
    categoryId: string
    imagePath: string | null
}

interface HustleFormProps {
    categories: Category[]
    hustleData?: HustleData
    onSuccess?: () => void
    onCancel?: () => void
}

export function HustleForm({ categories, hustleData, onSuccess, onCancel }: HustleFormProps) {
    const router = useRouter()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const isEditMode = !!hustleData

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [hustleType, setHustleType] = useState('INTERNSHIP')
    const [workMode, setWorkMode] = useState('REMOTE')
    const [priceType, setPriceType] = useState('') // empty string represents none
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [contactNo, setContactNo] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [imagePath, setImagePath] = useState('')
    const discardedImageIds = useRef<string[]>([])

    // Pre-fill form when editing
    useEffect(() => {
        if (hustleData) {
            setTitle(hustleData.title)
            setDescription(hustleData.description)
            setHustleType(hustleData.hustleType)
            setWorkMode(hustleData.workMode)
            setPriceType(hustleData.priceType || '')
            setMinPrice(hustleData.minPrice !== null ? String(hustleData.minPrice) : '')
            setMaxPrice(hustleData.maxPrice !== null ? String(hustleData.maxPrice) : '')
            setContactNo(hustleData.contactNo || '')
            setCategoryId(hustleData.categoryId)
            setImagePath(hustleData.imagePath || '')
        }
    }, [hustleData])

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }))

    const hustleTypeOptions = [
        { value: 'INTERNSHIP', label: 'Internship' },
        { value: 'FREELANCE', label: 'Freelance' },
        { value: 'PART_TIME', label: 'Part-Time Job' },
        { value: 'ONE_TIME', label: 'One-Time Task' },
    ]

    const workModeOptions = [
        { value: 'REMOTE', label: 'Remote' },
        { value: 'ON_SITE', label: 'On-site' },
        { value: 'HYBRID', label: 'Hybrid' },
    ]

    const priceTypeOptions = [
        { value: '', label: 'No compensation info / Unpaid' },
        { value: 'FIXED', label: 'Fixed Salary / Pay' },
        { value: 'RANGE', label: 'Salary Range' },
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

        if (!title.trim() || !description.trim() || !categoryId || !hustleType || !workMode) {
            setError('Please fill in all required fields')
            return
        }

        if (priceType === 'FIXED' && !minPrice) {
            setError('Please provide a salary amount')
            return
        }

        if (priceType === 'RANGE' && (!minPrice || !maxPrice)) {
            setError('Please provide both minimum and maximum salary')
            return
        }

        if (priceType === 'RANGE' && Number(maxPrice) < Number(minPrice)) {
            setError('Maximum salary must be greater than or equal to minimum salary')
            return
        }

        setIsLoading(true)

        const payload = {
            title,
            description,
            hustleType,
            workMode,
            priceType: priceType || null,
            minPrice: priceType ? Number(minPrice) : null,
            maxPrice: priceType === 'RANGE' ? Number(maxPrice) : null,
            contactNo: contactNo.trim() || null,
            categoryId,
            imagePath: imagePath || null,
            discardedImageIds: discardedImageIds.current,
        }

        try {
            const endpoint = isEditMode ? '/api/hustles/update' : '/api/hustles/create'
            const body = isEditMode ? { ...payload, hustleId: hustleData.id } : payload

            const result = await ApiClient.post(endpoint, body)

            if (result.ok) {
                toast.success(isEditMode ? 'Hustle updated successfully! Awaiting approval.' : 'Hustle listed successfully! Awaiting approval.')
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
                    label="Hustle Title"
                    placeholder="e.g. React Developer Intern, Part-time Tutor, Logo Design Task"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <Textarea
                    label="Opportunity Description"
                    placeholder="Describe the role, responsibilities, requirements, application process, qualifications required, working hours, and details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    disabled={isLoading}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Hustle Category"
                        placeholder="Select Category"
                        options={categoryOptions}
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Opportunity Type"
                        options={hustleTypeOptions}
                        value={hustleType}
                        onChange={(e) => setHustleType(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <Select
                        label="Work Mode"
                        options={workModeOptions}
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <Select
                        label="Compensation Type"
                        options={priceTypeOptions}
                        value={priceType}
                        onChange={(e) => {
                            setPriceType(e.target.value)
                            if (!e.target.value) {
                                setMinPrice('')
                                setMaxPrice('')
                            }
                        }}
                        disabled={isLoading}
                    />

                    {priceType !== '' && (
                        <Input
                            label={priceType === 'FIXED' ? 'Salary (LKR)' : 'Min Salary (LKR)'}
                            type="number"
                            placeholder="e.g. 25000"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            required
                            disabled={isLoading}
                            min={0}
                        />
                    )}

                    {priceType === 'RANGE' && (
                        <Input
                            label="Max Salary (LKR)"
                            type="number"
                            placeholder="e.g. 40000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            required
                            disabled={isLoading}
                            min={0}
                        />
                    )}
                </div>

                <Input
                    label="Contact / Application Details (Optional)"
                    placeholder="e.g. Link to application, email address, or phone number"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    disabled={isLoading}
                />

                <ImageUpload
                    label="Promo flyer / Logo (Optional)"
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
                    {isLoading ? 'Submitting...' : isEditMode ? 'Save Changes' : 'Post Hustle'}
                </Button>
            </div>
        </form>
    )
}
