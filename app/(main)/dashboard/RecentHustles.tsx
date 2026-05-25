'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { LinkifyText } from '@/components/ui/LinkifyText'
import { ApiClient } from '@/lib/api/api-client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { useState } from 'react'

interface UserHustle {
    id: string
    title: string
    description: string
    hustleType: string
    workMode: string
    isApproved: boolean
    createdAt: Date | string
}

interface RecentHustlesProps {
    hustles: UserHustle[]
}

export function RecentHustles({ hustles }: RecentHustlesProps) {
    const router = useRouter()
    const toast = useToast()
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const handleDelete = async (hustleId: string, title: string) => {
        if (!confirm(`Are you sure you want to delete hustle listing "${title}"?`)) {
            return
        }

        setIsDeleting(hustleId)
        try {
            const result = await ApiClient.post('/api/hustles/delete', { hustleId })
            if (result.ok) {
                router.refresh()
                toast.success('Hustle deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete hustle')
            }
        } finally {
            setIsDeleting(null)
        }
    }

    if (hustles.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-text-muted mb-4">You haven&apos;t posted any side hustles or jobs yet.</p>
                <Link
                    href="/hustles/create"
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                    Post Your First Hustle
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {hustles.map((hustle) => (
                <div
                    key={hustle.id}
                    className="flex items-start justify-between p-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors gap-3 border border-border/40"
                >
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <h4 className="font-semibold text-white truncate mr-2">{hustle.title}</h4>
                            <Badge variant="info" className="text-[9px] py-0.5 uppercase">{hustle.hustleType.replace('_', ' ')}</Badge>
                            <Badge variant="success" className="text-[9px] py-0.5 uppercase">{hustle.workMode.replace('_', ' ')}</Badge>
                        </div>
                        <LinkifyText className="text-sm text-text-muted line-clamp-2">
                            {hustle.description}
                        </LinkifyText>
                        <div className="flex items-center space-x-2 text-xs text-text-dim mt-2">
                            <span>
                                📅 {new Date(hustle.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href={`/hustles/edit/${hustle.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-accent border border-accent/40 bg-accent/10 hover:bg-accent/20 hover:border-accent/60 transition-all duration-200"
                            title="Edit hustle"
                        >
                            ✏️ Edit
                        </Link>
                        <button
                            onClick={() => handleDelete(hustle.id, hustle.title)}
                            disabled={isDeleting === hustle.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/60 transition-all duration-200 disabled:opacity-50"
                            title="Delete hustle"
                        >
                            🗑️ Delete
                        </button>
                        <Badge variant={hustle.isApproved ? 'success' : 'warning'} className="py-1.5">
                            {hustle.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    )
}
