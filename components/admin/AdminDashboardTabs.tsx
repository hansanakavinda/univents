'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { UniversityActions, AddUniversityButton } from '@/app/(main)/admin/universities/UniversityActions'
import { CategoryManager } from './CategoryManager'
import { ProductCategoryManager } from './ProductCategoryManager'
import { HustleCategoryManager } from './HustleCategoryManager'

interface University {
    id: string
    name: string
    shortName: string
    createdAt: Date | string
    _count: {
        users: number
        events: number
    }
}

interface Category {
    id: string
    name: string
    _count: {
        gigs: number
    }
}

interface ProductCategory {
    id: string
    name: string
    _count: {
        products: number
    }
}

interface HustleCategory {
    id: string
    name: string
    _count: {
        hustles: number
    }
}

interface AdminDashboardTabsProps {
    universities: University[]
    categories: Category[]
    productCategories: ProductCategory[]
    hustleCategories: HustleCategory[]
}

export function AdminDashboardTabs({ universities, categories, productCategories, hustleCategories }: AdminDashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<'universities' | 'categories' | 'productCategories' | 'hustleCategories'>('universities')

    return (
        <div className="space-y-6">
            {/* Tabs Selector */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('universities')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'universities'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    🏫 Universities
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'categories'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    🏷️ Gigs Categories
                </button>
                <button
                    onClick={() => setActiveTab('productCategories')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'productCategories'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    🛍️ Product Categories
                </button>
                <button
                    onClick={() => setActiveTab('hustleCategories')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'hustleCategories'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    ⚡ Hustle Categories
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'universities' && (
                <div className="space-y-6 animate-in">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">University Management</h2>
                            <p className="text-text-muted text-sm">Add, edit, or remove universities</p>
                        </div>
                        <AddUniversityButton />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Universities</CardDescription>
                                <CardTitle className="text-4xl text-accent">{universities.length}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Events</CardDescription>
                                <CardTitle className="text-4xl text-green-400">
                                    {universities.reduce((sum, u) => sum + u._count.events, 0)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Users</CardDescription>
                                <CardTitle className="text-4xl text-blue-400">
                                    {universities.reduce((sum, u) => sum + u._count.users, 0)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>All Universities</CardTitle>
                            <CardDescription>Manage registered universities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {universities.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-text-dim">No universities added yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {universities.map((university) => (
                                        <div
                                            key={university.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-surface-hover transition-colors border border-border/40"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <h4 className="font-semibold text-white">{university.name}</h4>
                                                    <Badge variant="default">{university.shortName}</Badge>
                                                </div>
                                                <div className="flex items-center space-x-4 text-xs text-text-dim">
                                                    <span>{university._count.events} event(s)</span>
                                                    <span>•</span>
                                                    <span>{university._count.users} user(s)</span>
                                                    <span>•</span>
                                                    <span>Added {new Date(university.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <UniversityActions university={university} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="animate-in">
                    <CategoryManager categories={categories} />
                </div>
            )}

            {activeTab === 'productCategories' && (
                <div className="animate-in">
                    <ProductCategoryManager categories={productCategories} />
                </div>
            )}

            {activeTab === 'hustleCategories' && (
                <div className="animate-in">
                    <HustleCategoryManager categories={hustleCategories} />
                </div>
            )}
        </div>
    )
}
