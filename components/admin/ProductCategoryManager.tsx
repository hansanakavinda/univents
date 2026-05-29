'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { ApiClient } from '@/lib/api/api-client'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface ProductCategory {
    id: string
    name: string
    _count: {
        products: number
    }
}

interface ProductCategoryManagerProps {
    categories: ProductCategory[]
}

export function ProductCategoryManager({ categories }: ProductCategoryManagerProps) {
    const router = useRouter()
    const toast = useToast()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsLoading(true)
        try {
            const result = await ApiClient.post('/api/admin/product-categories', { name })
            if (result.ok) {
                setName('')
                setIsAddOpen(false)
                router.refresh()
                toast.success('Product category created successfully')
            } else {
                toast.error(result.error || 'Failed to create category')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !activeCategory) return

        setIsLoading(true)
        try {
            const result = await ApiClient.put('/api/admin/product-categories', {
                id: activeCategory.id,
                name,
            })
            if (result.ok) {
                setName('')
                setActiveCategory(null)
                setIsEditOpen(false)
                router.refresh()
                toast.success('Product category updated successfully')
            } else {
                toast.error(result.error || 'Failed to update category')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (category: ProductCategory) => {
        if (category._count.products > 0) {
            toast.error('Cannot delete category because it has active items')
            return
        }

        if (!confirm(`Are you sure you want to delete category "${category.name}"?`)) {
            return
        }

        setIsLoading(true)
        try {
            const result = await ApiClient.delete('/api/admin/product-categories', {
                id: category.id,
            })
            if (result.ok) {
                router.refresh()
                toast.success('Product category deleted successfully')
            } else {
                toast.error(result.error || 'Failed to delete category')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                <div>
                    <CardTitle className="text-base font-semibold">All Product Categories</CardTitle>
                    <CardDescription className="text-xs">Manage shop product categories</CardDescription>
                </div>
                <Button variant="primary" size="sm" onClick={() => {
                    setName('')
                    setIsAddOpen(true)
                }} className="text-xs py-1.5 px-3 w-full sm:w-auto shrink-0">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                </Button>
            </CardHeader>
            <CardContent>
                {categories.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-text-dim mb-4">No product categories added yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between p-2.5 sm:p-4 gap-2 rounded-xl bg-surface hover:bg-surface-hover transition-colors border border-border/40"
                            >
                                <div className="flex-1 min-w-0 pr-1">
                                    <div className="flex items-center space-x-2 mb-0.5 min-w-0">
                                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate min-w-0">{category.name}</h4>
                                        <Badge variant="default" className="text-[9px] sm:text-[10px] py-0 px-1.5 bg-primary/20 text-accent border border-primary/30 shrink-0">
                                            {category._count.products} item(s)
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs py-1 px-1.5 sm:px-2.5"
                                        onClick={() => {
                                            setActiveCategory(category)
                                            setName(category.name)
                                            setIsEditOpen(true)
                                        }}
                                        disabled={isLoading}
                                        title="Edit Category"
                                    >
                                        ✏️<span className="hidden sm:inline ml-1">Edit</span>
                                    </Button>
                                    <Button
                                        variant={category._count.products > 0 ? "ghost" : "danger"}
                                        size="sm"
                                        className={`text-xs py-1 px-1.5 sm:px-2.5 ${category._count.products > 0 ? "opacity-30 cursor-not-allowed" : ""}`}
                                        onClick={() => handleDelete(category)}
                                        disabled={isLoading}
                                        title="Delete Category"
                                    >
                                        🗑️<span className="hidden sm:inline ml-1">Delete</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Add Modal */}
            <Modal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Add New Product Category"
                size="sm"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <Input
                        label="Category Name"
                        placeholder="e.g. Textbooks, Electronics, Clothing, Stationery"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        maxLength={100}
                    />
                    <div className="flex items-center space-x-3 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? 'Creating...' : 'Create Category'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsAddOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Product Category"
                size="sm"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                        label="Category Name"
                        placeholder="e.g. Textbooks, Electronics, Clothing, Stationery"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        maxLength={100}
                    />
                    <div className="flex items-center space-x-3 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setIsEditOpen(false)
                                setActiveCategory(null)
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </Card>
    )
}
