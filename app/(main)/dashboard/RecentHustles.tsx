'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { LinkifyText } from '@/components/ui/LinkifyText'
import { ApiClient } from '@/lib/api/api-client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { useState } from 'react'
import { Calendar, Edit3, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

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
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return
        setIsDeleting(true)
        try {
            const result = await ApiClient.post('/api/hustles/delete', { hustleId: deleteTarget.id })
            if (result.ok) {
                router.refresh()
                toast.success('Hustle deleted successfully')
                setDeleteTarget(null)
            } else {
                toast.error(result.error || 'Failed to delete hustle')
            }
        } finally {
            setIsDeleting(false)
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
                    className="relative flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(124,58,237,0.06)] hover:scale-[1.005] transition-all duration-300"
                >
                    {/* Status Dot */}
                    <div
                        className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${
                            hustle.isApproved
                                ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                                : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]'
                        }`}
                        title={hustle.isApproved ? 'Approved' : 'Pending Approval'}
                    />

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 mb-3 pr-6">
                        <div className="flex flex-wrap items-start gap-2 mb-2">
                            <h4 className="font-semibold text-white text-sm leading-snug tracking-tight">
                                {hustle.title}
                            </h4>
                            <div className="flex flex-wrap gap-1.5 mt-0.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-blue-900/30 text-blue-300 border border-blue-800/40 uppercase tracking-wide shrink-0">
                                    {hustle.hustleType.replace('_', ' ')}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-green-900/30 text-green-300 border border-green-800/40 uppercase tracking-wide shrink-0">
                                    {hustle.workMode.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-dim">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                                <span>
                                    Created {new Date(hustle.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                        <Link
                            href={`/hustles/edit/${hustle.id}`}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-accent border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:border-accent/40 transition-all duration-200 cursor-pointer shrink-0"
                            title="Edit hustle"
                        >
                            <Edit3 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-accent/80" />
                            <span className="hidden sm:inline ml-1">Edit</span>
                        </Link>
                        <button
                            onClick={() => setDeleteTarget({ id: hustle.id, title: hustle.title })}
                            disabled={isDeleting}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0"
                            title="Delete hustle"
                        >
                            <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-red-400/80" />
                            <span className="hidden sm:inline ml-1">Delete</span>
                        </button>
                    </div>
                </div>
            ))}

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Hustle Listing"
                description={`Are you sure you want to delete hustle listing "${deleteTarget?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    )
}
