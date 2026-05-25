'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { LinkifyText } from '@/components/ui/LinkifyText'
import { ApiClient } from '@/lib/api/api-client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { useState } from 'react'

interface UserProduct {
    id: string
    title: string
    description: string
    priceType: string
    price: number | null
    isApproved: boolean
    createdAt: Date | string
}

interface RecentProductsProps {
    products: UserProduct[]
}

export function RecentProducts({ products }: RecentProductsProps) {
    const router = useRouter()
    const toast = useToast()
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const handleDelete = async (productId: string, title: string) => {
        if (!confirm(`Are you sure you want to delete item "${title}"?`)) {
            return
        }

        setIsDeleting(productId)
        try {
            const result = await ApiClient.post('/api/products/delete', { productId })
            if (result.ok) {
                router.refresh()
                toast.success('Item deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete item')
            }
        } finally {
            setIsDeleting(null)
        }
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-text-muted mb-4">You haven&apos;t listed any items for sale yet.</p>
                <Link
                    href="/shop/create"
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                    List Your First Item
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="flex items-start justify-between p-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors gap-3 border border-border/40"
                >
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white mb-1">{product.title}</h4>
                        <LinkifyText className="text-sm text-text-muted line-clamp-2">
                            {product.description}
                        </LinkifyText>
                        <div className="flex items-center space-x-2 text-xs text-text-dim mt-2">
                            <span>
                                📅 {new Date(product.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href={`/shop/edit/${product.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-accent border border-accent/40 bg-accent/10 hover:bg-accent/20 hover:border-accent/60 transition-all duration-200"
                            title="Edit item"
                        >
                            ✏️ Edit
                        </Link>
                        <button
                            onClick={() => handleDelete(product.id, product.title)}
                            disabled={isDeleting === product.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/60 transition-all duration-200 disabled:opacity-50"
                            title="Delete item"
                        >
                            🗑️ Delete
                        </button>
                        <Badge variant={product.isApproved ? 'success' : 'warning'} className="py-1.5">
                            {product.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    )
}
