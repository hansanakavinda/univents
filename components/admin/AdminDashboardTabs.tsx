'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { UniversityActions, AddUniversityButton } from '@/app/(main)/admin/universities/UniversityActions'
import { CategoryManager } from './CategoryManager'
import { ProductCategoryManager } from './ProductCategoryManager'
import { HustleCategoryManager } from './HustleCategoryManager'
import { School, Briefcase, ShoppingBag, Zap } from 'lucide-react'

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

interface AdminDashboardTabButtonProps {
    tabId: 'universities' | 'categories' | 'productCategories' | 'hustleCategories'
    activeTab: 'universities' | 'categories' | 'productCategories' | 'hustleCategories'
    onClick: () => void
    label: string
    Icon: React.ComponentType<{ className?: string }>
}

function AdminDashboardTabButton({
    tabId,
    activeTab,
    onClick,
    label,
    Icon,
}: AdminDashboardTabButtonProps) {
    const isActive = activeTab === tabId
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all duration-300 cursor-pointer shrink-0 sm:flex-row sm:gap-2 sm:py-2.5 sm:px-5 sm:text-xs sm:font-semibold ${
                isActive
                    ? 'bg-primary/25 border border-primary/45 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                    : 'border border-transparent text-text-muted hover:text-white hover:bg-white/5'
            }`}
        >
            <Icon className={`w-4 h-4 sm:w-3.5 sm:h-3.5 mb-1 sm:mb-0 shrink-0 transition-colors ${
                isActive ? 'text-accent' : 'text-text-muted'
            }`} />
            <span className="text-[9px] sm:text-xs">{label}</span>
        </button>
    )
}

export function AdminDashboardTabs({ universities, categories, productCategories, hustleCategories }: AdminDashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<'universities' | 'categories' | 'productCategories' | 'hustleCategories'>('universities')

    return (
        <div className="space-y-6">
            {/* Tabs Selector */}
            <div className="flex items-center justify-around p-1.5 gap-1.5 max-w-4xl transition-all duration-300">
                <AdminDashboardTabButton
                    tabId="universities"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('universities')}
                    label="Universities"
                    Icon={School}
                />
                <AdminDashboardTabButton
                    tabId="categories"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('categories')}
                    label="Gigs"
                    Icon={Briefcase}
                />
                <AdminDashboardTabButton
                    tabId="productCategories"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('productCategories')}
                    label="Shop"
                    Icon={ShoppingBag}
                />
                <AdminDashboardTabButton
                    tabId="hustleCategories"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('hustleCategories')}
                    label="Hustles"
                    Icon={Zap}
                />
            </div>

            {/* Tab Contents */}
            {activeTab === 'universities' && (
                <div className="space-y-6 animate-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">University Management</h2>
                            <p className="text-text-muted text-xs">Add, edit, or remove universities</p>
                        </div>
                        <AddUniversityButton />
                    </div>

                    {/* Content & Stats Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                        {/* Stats Sidebar */}
                        <div className="lg:col-span-1 order-1 lg:order-2">
                            <div className="p-4 transition-all duration-300">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-purple-500/25 transition-all duration-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                                            <span className="text-[10px] font-semibold text-purple-200/90 tracking-wide">Total Universities</span>
                                        </div>
                                        <span className="text-xs font-extrabold text-purple-400">{universities.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                            <span className="text-[10px] font-semibold text-emerald-200/90 tracking-wide">Total Events</span>
                                        </div>
                                        <span className="text-xs font-extrabold text-emerald-400 font-mono">
                                            {universities.reduce((sum, u) => sum + u._count.events, 0)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 hover:border-blue-500/25 transition-all duration-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.5)]" />
                                            <span className="text-[10px] font-semibold text-blue-200/90 tracking-wide">Total Users</span>
                                        </div>
                                        <span className="text-xs font-extrabold text-blue-400 font-mono">
                                            {universities.reduce((sum, u) => sum + u._count.users, 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main list */}
                        <div className="lg:col-span-3 order-2 lg:order-1">
                            <Card>
                                <CardHeader className="py-4">
                                    <CardTitle className="text-base font-semibold">All Universities</CardTitle>
                                    <CardDescription className="text-xs">Manage registered universities</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {universities.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-text-dim text-xs">No universities added yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {universities.map((university) => (
                                                <div
                                                    key={university.id}
                                                    className="flex items-center justify-between p-2.5 sm:p-4 gap-2 rounded-xl bg-surface hover:bg-surface-hover transition-colors border border-border/40"
                                                >
                                                    <div className="flex-1 min-w-0 pr-1">
                                                        <div className="flex items-center space-x-2 mb-0.5 min-w-0">
                                                            <h4 className="text-xs sm:text-sm font-semibold text-white truncate min-w-0">{university.name}</h4>
                                                            <Badge variant="default" className="text-[9px] sm:text-[10px] py-0 px-1.5 shrink-0">{university.shortName}</Badge>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-text-dim truncate">
                                                            <span>{university._count.events} event(s)</span>
                                                            <span className="text-border/60">•</span>
                                                            <span>{university._count.users} user(s)</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center shrink-0">
                                                        <UniversityActions university={university} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
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
