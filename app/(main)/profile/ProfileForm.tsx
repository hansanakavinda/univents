'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { Dropdown } from '@/components/ui/Dropdown'

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
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

            <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-6 -mt-10 sm:-mt-12 mb-4 relative z-10">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[#18181b] border-4 border-[#0e0e11] shadow-xl flex items-center justify-center">
                        {initialData.image ? (
                            <img src={initialData.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl sm:text-3xl text-purple-300 font-bold">{name ? name.charAt(0).toUpperCase() : 'U'}</span>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-text-muted mb-1.5">Email</label>
                        <input
                            type="email"
                            value={initialData.email}
                            disabled
                            className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[#111120] border border-border/40 text-sm sm:text-base text-text-muted opacity-50 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-text-muted mb-1.5">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-surface border border-border text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-text-muted mb-1.5">University</label>
                        <Dropdown
                            value={uniId}
                            onChange={(val) => setUniId(val)}
                            options={universities.map((uni) => ({
                                value: uni.id,
                                label: `${uni.name} (${uni.shortName})`
                            }))}
                            placeholder="None / Other"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:justify-end border-t border-white/5 mt-4 sm:mt-6">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}
