'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

interface University {
    id: string
    name: string
}

interface UserUniversitySelectProps {
    userId: string
    currentUniId: string | null
    universities: University[]
    isCurrentUser: boolean
}

export function UserUniversitySelect({
    userId,
    currentUniId,
    universities,
    isCurrentUser,
}: UserUniversitySelectProps) {
    const router = useRouter()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const handleChangeUniversity = async (newUniId: string) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/users/change-university', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, uniId: newUniId }),
            })

            if (response.ok) {
                router.refresh()
                toast.success(`User's university updated successfully`)
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || 'Failed to update user university')
                // Re-render to revert the select field change if it fails
                router.refresh()
            }
        } catch (error) {
            toast.error('An error occurred while changing user university')
            router.refresh()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <select
            className="max-w-[150px] px-3 py-1.5 text-sm rounded-lg border border-[#E5E5E4] bg-white text-[#4B3621] focus:outline-none focus:ring-2 focus:ring-[#CC5500] disabled:opacity-50 truncate"
            value={currentUniId || 'none'}
            onChange={(e) => handleChangeUniversity(e.target.value)}
            title={universities.find(u => u.id === currentUniId)?.name || 'None'}
            disabled={isLoading || isCurrentUser}
        >
            <option value="none" className="text-gray-500 italic">None</option>
            {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                    {uni.name}
                </option>
            ))}
        </select>
    )
}
