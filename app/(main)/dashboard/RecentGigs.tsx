'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { LinkifyText } from '@/components/ui/LinkifyText'
import { ApiClient } from '@/lib/api/api-client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { useState } from 'react'

interface UserGig {
    id: string
    title: string
    description: string
    priceType: string
    minPrice: number | null
    maxPrice: number | null
    isApproved: boolean
    createdAt: Date | string
}

interface RecentGigsProps {
    gigs: UserGig[]
}

export function RecentGigs({ gigs }: RecentGigsProps) {
    const router = useRouter()
    const toast = useToast()
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const handleDelete = async (gigId: string, title: string) => {
        if (!confirm(`Are you sure you want to delete gig "${title}"?`)) {
            return
        }

        setIsDeleting(gigId)
        try {
            const result = await ApiClient.post('/api/gigs/delete', { gigId })
            if (result.ok) {
                router.refresh()
                toast.success('Gig deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete gig')
            }
        } finally {
            setIsDeleting(null)
        }
    }

    if (gigs.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-text-muted mb-4">You haven&apos;t created any gigs yet.</p>
                <Link
                    href="/gigs/create"
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                    Create Your First Gig
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {gigs.map((gig) => (
                <div
                    key={gig.id}
                    className="flex items-start justify-between p-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors gap-3 border border-border/40"
                >
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white mb-1">{gig.title}</h4>
                        <LinkifyText className="text-sm text-text-muted line-clamp-2">
                            {gig.description}
                        </LinkifyText>
                        <div className="flex items-center space-x-2 text-xs text-text-dim mt-2">
                            <span>
                                📅 {new Date(gig.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href={`/gigs/edit/${gig.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-accent border border-accent/40 bg-accent/10 hover:bg-accent/20 hover:border-accent/60 transition-all duration-200"
                            title="Edit gig"
                        >
                            ✏️ Edit
                        </Link>
                        <button
                            onClick={() => handleDelete(gig.id, gig.title)}
                            disabled={isDeleting === gig.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/60 transition-all duration-200 disabled:opacity-50"
                            title="Delete gig"
                        >
                            🗑️ Delete
                        </button>
                        <Badge variant={gig.isApproved ? 'success' : 'warning'} className="py-1.5">
                            {gig.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    )
}
