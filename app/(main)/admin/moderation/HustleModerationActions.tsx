'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { ApiClient } from '@/lib/api/api-client'

interface HustleModerationActionsProps {
    hustleId: string
}

export function HustleModerationActions({ hustleId }: HustleModerationActionsProps) {
    const router = useRouter()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const handleApprove = async () => {
        setIsLoading(true)
        try {
            const result = await ApiClient.post('/api/admin/hustles/moderate', {
                hustleId,
                action: 'approve',
            })

            if (result.ok) {
                router.refresh()
                toast.success('Hustle approved successfully')
            } else {
                toast.error(result.error || 'Failed to approve hustle')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleReject = async () => {
        if (!confirm('Are you sure you want to reject and delete this hustle?')) {
            return
        }

        setIsLoading(true)
        try {
            const result = await ApiClient.post('/api/admin/hustles/moderate', {
                hustleId,
                action: 'reject',
            })

            if (result.ok) {
                router.refresh()
                toast.success('Hustle rejected successfully')
            } else {
                toast.error(result.error || 'Failed to reject hustle')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-3">
            <Button
                variant="secondary"
                onClick={handleApprove}
                disabled={isLoading}
            >
                ✓ Approve
            </Button>
            <Button
                variant="danger"
                onClick={handleReject}
                disabled={isLoading}
            >
                ✕ Reject
            </Button>
        </div>
    )
}
