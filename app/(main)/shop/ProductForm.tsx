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

export interface ProductData {
    id: string
    title: string
    description: string
    imagePath: string | null
    priceType: string
    price: number | null
    contactNo: string
    categoryId: string
    uniId: string
}

interface ProductFormProps {
    universities: University[]
    categories: Category[]
    productData?: ProductData
    onSuccess?: () => void
    onCancel?: () => void
}

export function ProductForm({ universities, categories, productData, onSuccess, onCancel }: ProductFormProps) {
    const router = useRouter()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const isEditMode = !!productData

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imagePath, setImagePath] = useState('')
    const [priceType, setPriceType] = useState('FIXED')
    const [price, setPrice] = useState('')
    const [contactNo, setContactNo] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [uniId, setUniId] = useState('')
    const discardedImageIds = useRef<string[]>([])

    // Pre-fill form when editing
    useEffect(() => {
        if (productData) {
            setTitle(productData.title)
            setDescription(productData.description)
            setImagePath(productData.imagePath || '')
            setPriceType(productData.priceType)
            setPrice(productData.price !== null ? String(productData.price) : '')
            setContactNo(productData.contactNo)
            setCategoryId(productData.categoryId)
            setUniId(productData.uniId)
        }
    }, [productData])

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

        if (priceType === 'FIXED' && !price) {
            setError('Please provide a price')
            return
        }

        setIsLoading(true)

        const payload = {
            title,
            description,
            imagePath: imagePath || null,
            priceType,
            price: priceType === 'FIXED' ? Number(price) : null,
            contactNo,
            categoryId,
            uniId,
            discardedImageIds: discardedImageIds.current,
        }

        try {
            const endpoint = isEditMode ? '/api/products/update' : '/api/products/create'
            const body = isEditMode ? { ...payload, productId: productData.id } : payload

            const result = await ApiClient.post(endpoint, body)

            if (result.ok) {
                toast.success(isEditMode ? 'Item updated successfully! Awaiting approval.' : 'Item listed successfully! Awaiting approval.')
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
                    label="Item Title"
                    placeholder="e.g. Draughting Board, University Chemistry Textbook"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <Textarea
                    label="Item Description"
                    placeholder="Describe your item's condition, age, accessories included, or any other notes. Encourage buyers by stating details clearly!"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <Select
                        label="Price Type"
                        options={priceTypeOptions}
                        value={priceType}
                        onChange={(e) => {
                            setPriceType(e.target.value)
                            if (e.target.value === 'NEGOTIABLE') {
                                setPrice('')
                            }
                        }}
                        required
                        disabled={isLoading}
                    />

                    {priceType === 'FIXED' && (
                        <Input
                            label="Price (LKR)"
                            type="number"
                            placeholder="e.g. 1500"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
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
                    label="Item Image"
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
                    {isLoading ? 'Submitting...' : isEditMode ? 'Save Changes' : 'List Item'}
                </Button>
            </div>
        </form>
    )
}
