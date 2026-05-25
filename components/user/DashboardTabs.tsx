'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { RecentEvents } from '@/app/(main)/dashboard/RecentEvents'
import { RecentGigs } from '@/app/(main)/dashboard/RecentGigs'
import { RecentProducts } from '@/app/(main)/dashboard/RecentProducts'
import { RecentHustles } from '@/app/(main)/dashboard/RecentHustles'
import { Calendar, Briefcase, ShoppingBag, Zap, CheckCircle2, Clock, Layers } from 'lucide-react'

interface UserEvent {
    id: string
    title: string
    content: string
    imagePath: string | null
    endDate: Date | string | null
    isComingSoon: boolean
    eventTime?: string | null
    venue?: string | null
    uniId: string
    isApproved: boolean
    createdAt: Date | string
    university: {
        name: string
        shortName: string
    }
}

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

interface UserProduct {
    id: string
    title: string
    description: string
    priceType: string
    price: number | null
    isApproved: boolean
    createdAt: Date | string
}

interface UserHustle {
    id: string
    title: string
    description: string
    hustleType: string
    workMode: string
    isApproved: boolean
    createdAt: Date | string
}

interface DashboardTabsProps {
    userEvents: UserEvent[]
    totalEvents: number
    approvedEvents: number
    pendingEvents: number
    userGigs: UserGig[]
    totalGigs: number
    approvedGigs: number
    pendingGigs: number
    userProducts: UserProduct[]
    totalProducts: number
    approvedProducts: number
    pendingProducts: number
    userHustles: UserHustle[]
    totalHustles: number
    approvedHustles: number
    pendingHustles: number
}

export function DashboardTabs({
    userEvents,
    totalEvents,
    approvedEvents,
    pendingEvents,
    userGigs,
    totalGigs,
    approvedGigs,
    pendingGigs,
    userProducts,
    totalProducts,
    approvedProducts,
    pendingProducts,
    userHustles,
    totalHustles,
    approvedHustles,
    pendingHustles,
}: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<'events' | 'gigs' | 'products' | 'hustles'>('events')

    return (
        <div className="space-y-6">
            {/* Tab Selector */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:border-b sm:border-border/40 sm:gap-1 pb-4 sm:pb-0">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`flex items-center justify-center sm:justify-start gap-2 py-3 px-4 sm:px-6 text-sm font-medium transition-all duration-200 cursor-pointer shrink-0 rounded-xl sm:rounded-none sm:rounded-t-xl sm:border-b-2 sm:-mb-[2px] ${
                        activeTab === 'events'
                            ? 'bg-primary sm:bg-transparent text-white font-semibold sm:border-primary shadow-md shadow-primary/10 sm:shadow-none'
                            : 'bg-surface/30 border border-border/30 sm:bg-transparent sm:border-transparent text-text-muted hover:text-white sm:border-b-2'
                    }`}
                >
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>Events</span>
                </button>
                <button
                    onClick={() => setActiveTab('hustles')}
                    className={`flex items-center justify-center sm:justify-start gap-2 py-3 px-4 sm:px-6 text-sm font-medium transition-all duration-200 cursor-pointer shrink-0 rounded-xl sm:rounded-none sm:rounded-t-xl sm:border-b-2 sm:-mb-[2px] ${
                        activeTab === 'hustles'
                            ? 'bg-primary sm:bg-transparent text-white font-semibold sm:border-primary shadow-md shadow-primary/10 sm:shadow-none'
                            : 'bg-surface/30 border border-border/30 sm:bg-transparent sm:border-transparent text-text-muted hover:text-white sm:border-b-2'
                    }`}
                >
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>Hustles</span>
                </button>
                <button
                    onClick={() => setActiveTab('gigs')}
                    className={`flex items-center justify-center sm:justify-start gap-2 py-3 px-4 sm:px-6 text-sm font-medium transition-all duration-200 cursor-pointer shrink-0 rounded-xl sm:rounded-none sm:rounded-t-xl sm:border-b-2 sm:-mb-[2px] ${
                        activeTab === 'gigs'
                            ? 'bg-primary sm:bg-transparent text-white font-semibold sm:border-primary shadow-md shadow-primary/10 sm:shadow-none'
                            : 'bg-surface/30 border border-border/30 sm:bg-transparent sm:border-transparent text-text-muted hover:text-white sm:border-b-2'
                    }`}
                >
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>Gigs</span>
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex items-center justify-center sm:justify-start gap-2 py-3 px-4 sm:px-6 text-sm font-medium transition-all duration-200 cursor-pointer shrink-0 rounded-xl sm:rounded-none sm:rounded-t-xl sm:border-b-2 sm:-mb-[2px] ${
                        activeTab === 'products'
                            ? 'bg-primary sm:bg-transparent text-white font-semibold sm:border-primary shadow-md shadow-primary/10 sm:shadow-none'
                            : 'bg-surface/30 border border-border/30 sm:bg-transparent sm:border-transparent text-text-muted hover:text-white sm:border-b-2'
                    }`}
                >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>Shop</span>
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'events' ? (
                <div className="space-y-6 animate-in">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Total Events</span>
                                <Layers className="h-4 w-4 text-accent/80 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-white tracking-tight">{totalEvents}</div>
                                <p className="text-xs text-text-dim mt-1">All your submitted events</p>
                            </div>
                        </Card>

                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Approved</span>
                                <CheckCircle2 className="h-4 w-4 text-emerald-400/80 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{approvedEvents}</div>
                                <p className="text-xs text-text-dim mt-1">Visible to the public</p>
                            </div>
                        </Card>

                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Pending Approval</span>
                                <Clock className="h-4 w-4 text-amber-400/80 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{pendingEvents}</div>
                                <p className="text-xs text-text-dim mt-1">Awaiting moderation</p>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Events List */}
                    <Card className="p-4 sm:p-6">
                        <CardHeader className="mb-4">
                            <CardTitle className="text-lg sm:text-xl">Your Recent Events</CardTitle>
                            <CardDescription>Your latest submissions and their status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentEvents events={userEvents} />
                        </CardContent>
                    </Card>
                </div>
            ) : activeTab === 'hustles' ? (
                <div className="space-y-6 animate-in">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Total Hustles</span>
                                <Layers className="h-4 w-4 text-accent/80 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-white tracking-tight">{totalHustles}</div>
                                <p className="text-xs text-text-dim mt-1">All your listed opportunities</p>
                            </div>
                        </Card>

                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Approved</span>
                                <CheckCircle2 className="h-4 w-4 text-emerald-400/80 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{approvedHustles}</div>
                                <p className="text-xs text-text-dim mt-1">Visible to the public</p>
                            </div>
                        </Card>

                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Pending Approval</span>
                                <Clock className="h-4 w-4 text-amber-400/80 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{pendingHustles}</div>
                                <p className="text-xs text-text-dim mt-1">Awaiting moderation</p>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Hustles List */}
                    <Card className="p-4 sm:p-6">
                        <CardHeader className="mb-4">
                            <CardTitle className="text-lg sm:text-xl">Your Recent Hustles</CardTitle>
                            <CardDescription>Your latest listed opportunities and their status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentHustles hustles={userHustles} />
                        </CardContent>
                    </Card>
                </div>
            ) : activeTab === 'gigs' ? (
                <div className="space-y-6 animate-in">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Total Gigs</span>
                                <Layers className="h-4 w-4 text-accent/80 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-white tracking-tight">{totalGigs}</div>
                                <p className="text-xs text-text-dim mt-1">All your submitted gigs</p>
                            </div>
                        </Card>

                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Approved</span>
                                <CheckCircle2 className="h-4 w-4 text-emerald-400/80 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{approvedGigs}</div>
                                <p className="text-xs text-text-dim mt-1">Visible to the public</p>
                            </div>
                        </Card>

                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Pending Approval</span>
                                <Clock className="h-4 w-4 text-amber-400/80 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{pendingGigs}</div>
                                <p className="text-xs text-text-dim mt-1">Awaiting moderation</p>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Gigs List */}
                    <Card className="p-4 sm:p-6">
                        <CardHeader className="mb-4">
                            <CardTitle className="text-lg sm:text-xl">Your Recent Gigs</CardTitle>
                            <CardDescription>Your latest submissions and their status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentGigs gigs={userGigs} />
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="space-y-6 animate-in">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Total Products</span>
                                <Layers className="h-4 w-4 text-accent/80 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-white tracking-tight">{totalProducts}</div>
                                <p className="text-xs text-text-dim mt-1">All your listed items</p>
                            </div>
                        </Card>

                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Approved</span>
                                <CheckCircle2 className="h-4 w-4 text-emerald-400/80 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{approvedProducts}</div>
                                <p className="text-xs text-text-dim mt-1">Visible to the public</p>
                            </div>
                        </Card>

                        <Card hover className="relative overflow-hidden group p-4 sm:p-6">
                            <div className="flex items-center justify-between pb-2 mb-2">
                                <span className="text-sm font-medium text-text-muted group-hover:text-white transition-colors">Pending Approval</span>
                                <Clock className="h-4 w-4 text-amber-400/80 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{pendingProducts}</div>
                                <p className="text-xs text-text-dim mt-1">Awaiting moderation</p>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Products List */}
                    <Card className="p-4 sm:p-6">
                        <CardHeader className="mb-4">
                            <CardTitle className="text-lg sm:text-xl">Your Recent Listed Items</CardTitle>
                            <CardDescription>Your latest items and their moderation status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentProducts products={userProducts} />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
