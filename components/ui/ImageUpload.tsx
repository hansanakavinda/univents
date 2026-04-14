'use client'

import { useState, useRef } from 'react'
import { useToast } from '@/components/ui/Toast'
import Image from 'next/image'

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    onDiscard?: (publicId: string) => void
    disabled?: boolean
    label?: string
}

const MAX_SIZE_MB = 3
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export function ImageUpload({ value, onChange, onDiscard, disabled, label = 'Event Image' }: ImageUploadProps) {
    const toast = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(value || null)
    const [publicId, setPublicId] = useState<string | null>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Client-side validations
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        if (file.size > MAX_SIZE_BYTES) {
            toast.error(`Image must be under ${MAX_SIZE_MB}MB`)
            return
        }

        // Show preview immediately
        const localPreview = URL.createObjectURL(file)
        setPreview(localPreview)

        // Upload to server
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Upload failed')
            }

            const data = await response.json()
            setPreview(data.url)
            setPublicId(data.publicId)
            onChange(data.url)
            toast.success('Image uploaded successfully')
        } catch (err) {
            setPreview(null)
            onChange('')
            toast.error(err instanceof Error ? err.message : 'Failed to upload image')
        } finally {
            setIsUploading(false)
            // Reset file input so the same file can be selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleRemove = () => {
        // Pass publicId to parent for server-side cleanup
        if (publicId && onDiscard) {
            onDiscard(publicId)
        }
        setPreview(null)
        setPublicId(null)
        onChange('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-[#c4c4cc] mb-1.5">
                {label} <span className="text-[#6b6b7b] font-normal">(optional, max {MAX_SIZE_MB}MB)</span>
            </label>

            {preview ? (
                <div className="relative rounded-xl overflow-hidden border border-[#2d2d44]">
                    <Image
                        src={preview}
                        alt="Preview"
                        width={500}
                        height={500}
                        className="w-full h-48 object-cover"
                    />
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="flex items-center space-x-2 text-white">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm font-medium">Uploading...</span>
                            </div>
                        </div>
                    )}
                    {!isUploading && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={disabled}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                    className="
                        w-full py-8 rounded-xl border-2 border-dashed border-[#2d2d44]
                        hover:border-[#7c3aed] hover:bg-[#1a1a2e]
                        transition-all duration-200 cursor-pointer
                        disabled:cursor-not-allowed disabled:opacity-50
                        flex flex-col items-center justify-center space-y-2
                    "
                >
                    <svg className="w-8 h-8 text-[#6b6b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-[#9ca3af]">Click to upload an image</span>
                    <span className="text-xs text-[#6b6b7b]">PNG, JPG, WebP up to {MAX_SIZE_MB}MB</span>
                </button>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || isUploading}
            />
        </div>
    )
}
