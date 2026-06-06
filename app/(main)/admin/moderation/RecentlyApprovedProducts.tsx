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

interface ApprovedProduct {
    id: string
    title: string
    description: string
    priceType: string
    price: number | null
    category: {
        name: string
    }
    updatedAt: Date | string
    author: {
        name: string | null
    }
    university: {
        shortName: string
    }
}

interface RecentlyApprovedProductsProps {
    products: ApprovedProduct[]
}

export function RecentlyApprovedProducts({ products }: RecentlyApprovedProductsProps) {
    const router = useRouter()
    const toast = useToast()
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const pendingProduct = products.find((p) => p.id === pendingDeleteId)

    const formatPrice = (product: ApprovedProduct) => {
        if (product.priceType === 'NEGOTIABLE') return 'Negotiable'
        return `LKR ${product.price?.toLocaleString()}`
    }

    const handleDeleteConfirm = async () => {
        if (!pendingDeleteId) return

        setIsDeleting(true)
        try {
            const result = await ApiClient.post('/api/products/delete', {
                productId: pendingDeleteId,
            })

            if (result.ok) {
                router.refresh()
                toast.success('Item deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete item')
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
                    <CardTitle>Recently Approved Items</CardTitle>
                    <CardDescription>Latest approved shop items</CardDescription>
                </CardHeader>
                <CardContent>
                    {products.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-text-dim">No approved items yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="p-4 rounded-xl bg-surface border-l-4 border-green-500"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-white mb-1 break-words">{product.title}</h4>
                                            <LinkifyText className="text-sm text-text-muted mb-2 line-clamp-2">
                                                {product.description}
                                            </LinkifyText>
                                            <div className="flex items-center flex-wrap gap-2 text-xs text-text-dim">
                                                <span className="whitespace-nowrap">{product.author.name || 'Unknown'}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">{product.university.shortName}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">Category: {product.category.name}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap text-green-400 font-semibold">{formatPrice(product)}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="whitespace-nowrap">{new Date(product.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 mt-2 sm:mt-0">
                                            <Badge variant="success">Approved</Badge>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => setPendingDeleteId(product.id)}
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
                title="Delete Shop Item"
                description={
                    pendingProduct
                        ? `Are you sure you want to permanently delete item "${pendingProduct.title}"? This action cannot be undone.`
                        : 'Are you sure you want to permanently delete this item? This action cannot be undone.'
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    )
}
