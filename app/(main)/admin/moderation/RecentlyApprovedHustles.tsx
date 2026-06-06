'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { LinkifyText } from '@/components/ui/LinkifyText'
import { ApiClient } from '@/lib/api/api-client'

interface ApprovedHustle {
    id: string
    title: string
    description: string
    hustleType: string
    workMode: string
    priceType: string | null
    minPrice: number | null
    maxPrice: number | null
    category: {
        name: string
    }
    updatedAt: Date | string
    author: {
        name: string | null
    }
}

interface RecentlyApprovedHustlesProps {
    hustles: ApprovedHustle[]
}

export function RecentlyApprovedHustles({ hustles }: RecentlyApprovedHustlesProps) {
    const router = useRouter()
    const toast = useToast()
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const pendingHustle = hustles.find((h) => h.id === pendingDeleteId)

    const formatCompensation = (hustle: ApprovedHustle) => {
        if (!hustle.priceType) return 'Unpaid / Not specified'
        if (hustle.priceType === 'FIXED') return `LKR ${hustle.minPrice?.toLocaleString()}`
        return `LKR ${hustle.minPrice?.toLocaleString()} - ${hustle.maxPrice?.toLocaleString()}`
    }

    const handleDeleteConfirm = async () => {
        if (!pendingDeleteId) return

        setIsDeleting(true)
        try {
            const result = await ApiClient.post('/api/hustles/delete', {
                hustleId: pendingDeleteId,
            })

            if (result.ok) {
                router.refresh()
                toast.success('Hustle deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete hustle')
            }
        } finally {
            setIsDeleting(false)
            setPendingDeleteId(null)
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Recently Approved Hustles</CardTitle>
                    <CardDescription>Latest approved working opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                    {hustles.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-text-dim">No approved hustles yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {hustles.map((hustle) => (
                                <div
                                    key={hustle.id}
                                    className="p-4 rounded-xl bg-surface border-l-4 border-green-500"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                <h4 className="font-semibold text-white break-words">{hustle.title}</h4>
                                                <Badge variant="info" className="text-[9px] py-0.5 uppercase">{hustle.hustleType.replace('_', ' ')}</Badge>
                                                <Badge variant="success" className="text-[9px] py-0.5 uppercase">{hustle.workMode.replace('_', ' ')}</Badge>
                                            </div>
                                            <LinkifyText className="text-sm text-text-muted mb-2 line-clamp-2">
                                                {hustle.description}
                                            </LinkifyText>
                                            <div className="flex items-center flex-wrap gap-2 text-xs text-text-dim">
                                                <span className="whitespace-nowrap">{hustle.author.name || 'Unknown'}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">Category: {hustle.category.name}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap text-green-400 font-semibold">{formatCompensation(hustle)}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">{new Date(hustle.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 mt-2 sm:mt-0">
                                            <Badge variant="success">Approved</Badge>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => setPendingDeleteId(hustle.id)}
                                                disabled={isDeleting}
                                            >
                                                ✕ Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmDialog
                isOpen={!!pendingDeleteId}
                onClose={() => setPendingDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Hustle Listing"
                description={
                    pendingHustle
                        ? `Are you sure you want to permanently delete hustle listing "${pendingHustle.title}"? This action cannot be undone.`
                        : 'Are you sure you want to permanently delete this hustle? This action cannot be undone.'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    )
}
