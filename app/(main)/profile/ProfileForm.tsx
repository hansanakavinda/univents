'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

interface ProfileFormProps {
    initialData: {
        name: string
        uniId: string
        image: string
        email: string
    }
    universities: { id: string, name: string, shortName: string }[]
}

export function ProfileForm({ initialData, universities }: ProfileFormProps) {
    const [name, setName] = useState(initialData.name)
    const [uniId, setUniId] = useState(initialData.uniId)
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()
    const toast = useToast()



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (name === initialData.name && uniId === initialData.uniId) {
            toast.info('No changes made to your profile data')
            return
        }

        setIsSaving(true)

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    uniId: uniId || null,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update profile')
            }

            toast.success('Profile updated successfully!')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-surface border border-border flex items-center justify-center">
                        {initialData.image ? (
                            <img src={initialData.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl text-text-muted font-bold">{name ? name.charAt(0).toUpperCase() : 'U'}</span>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
                        <input
                            type="email"
                            value={initialData.email}
                            disabled
                            className="w-full px-4 py-2 rounded-xl bg-black border border-border text-text-muted opacity-50 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-xl bg-black border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">University</label>
                        <select
                            value={uniId}
                            onChange={(e) => setUniId(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-black border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">None / Other</option>
                            {universities.map((uni) => (
                                <option key={uni.id} value={uni.id}>{uni.name} ({uni.shortName})</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-border mt-6">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors disabled:opacity-50 mt-4"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}
