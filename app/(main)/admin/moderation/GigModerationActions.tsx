'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { ApiClient } from '@/lib/api/api-client'

interface GigModerationActionsProps {
    gigId: string
}

export function GigModerationActions({ gigId }: GigModerationActionsProps) {
    const router = useRouter()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const handleApprove = async () => {
        setIsLoading(true)
        try {
            const result = await ApiClient.post('/api/admin/gigs/moderate', {
                gigId,
                action: 'approve',
            })

            if (result.ok) {
                router.refresh()
                toast.success('Gig approved successfully')
            } else {
                toast.error(result.error || 'Failed to approve gig')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleReject = async () => {
        if (!confirm('Are you sure you want to reject and delete this gig?')) {
            return
        }

        setIsLoading(true)
        try {
            const result = await ApiClient.post('/api/admin/gigs/moderate', {
                gigId,
                action: 'reject',
            })

            if (result.ok) {
                router.refresh()
                toast.success('Gig rejected successfully')
            } else {
                toast.error(result.error || 'Failed to reject gig')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Button
                variant="secondary"
                size="sm"
                className="text-xs py-1 px-2.5"
                onClick={handleApprove}
                disabled={isLoading}
            >
                ✓ Approve
            </Button>
            <Button
                variant="danger"
                size="sm"
                className="text-xs py-1 px-2.5"
                onClick={handleReject}
                disabled={isLoading}
            >
                ✕ Reject
            </Button>
        </div>
    )
}
