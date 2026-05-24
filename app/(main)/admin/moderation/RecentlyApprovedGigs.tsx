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

interface ApprovedGig {
    id: string
    title: string
    description: string
    priceType: string
    minPrice: number | null
    maxPrice: number | null
    category: {
        name: string
    }
    updatedAt: Date | string
    author: {
        name: string | null
        email: string
    }
    university: {
        shortName: string
    }
}

interface RecentlyApprovedGigsProps {
    gigs: ApprovedGig[]
}

export function RecentlyApprovedGigs({ gigs }: RecentlyApprovedGigsProps) {
    const router = useRouter()
    const toast = useToast()
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const pendingGig = gigs.find((g) => g.id === pendingDeleteId)

    const formatPrice = (gig: ApprovedGig) => {
        if (gig.priceType === 'NEGOTIABLE') return 'Negotiable'
        if (gig.priceType === 'FIXED') return `LKR ${gig.minPrice?.toLocaleString()}`
        return `LKR ${gig.minPrice?.toLocaleString()} - ${gig.maxPrice?.toLocaleString()}`
    }

    const handleDeleteConfirm = async () => {
        if (!pendingDeleteId) return

        setIsDeleting(true)
        try {
            const result = await ApiClient.post('/api/gigs/delete', {
                gigId: pendingDeleteId,
            })

            if (result.ok) {
                router.refresh()
                toast.success('Gig deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete gig')
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
                    <CardTitle>Recently Approved</CardTitle>
                    <CardDescription>Latest approved gigs</CardDescription>
                </CardHeader>
                <CardContent>
                    {gigs.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-text-dim">No approved gigs yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {gigs.map((gig) => (
                                <div
                                    key={gig.id}
                                    className="p-4 rounded-xl bg-surface border-l-4 border-green-500"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-white mb-1 break-words">{gig.title}</h4>
                                            <LinkifyText className="text-sm text-text-muted mb-2 line-clamp-2">
                                                {gig.description}
                                            </LinkifyText>
                                            <div className="flex items-center flex-wrap gap-2 text-xs text-text-dim">
                                                <span className="whitespace-nowrap">{gig.author.name || 'Unknown'}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">{gig.university.shortName}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">Category: {gig.category.name}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap text-green-400 font-semibold">{formatPrice(gig)}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">{new Date(gig.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 mt-2 sm:mt-0">
                                            <Badge variant="success">Approved</Badge>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => setPendingDeleteId(gig.id)}
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
                title="Delete Gig"
                description={
                    pendingGig
                        ? `Are you sure you want to permanently delete gig "${pendingGig.title}"? This action cannot be undone.`
                        : 'Are you sure you want to permanently delete this gig? This action cannot be undone.'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    )
}
