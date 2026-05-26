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
            <div className="flex items-center justify-around bg-black/45 backdrop-blur-md border border-border/40 rounded-2xl p-1.5 gap-1 sm:flex sm:bg-transparent sm:border-0 sm:border-b sm:border-border/40 sm:rounded-none sm:p-0 sm:gap-1 sm:pb-0">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all duration-200 cursor-pointer shrink-0 sm:flex-row sm:justify-start sm:py-3 sm:px-6 sm:text-sm sm:font-medium sm:rounded-none sm:rounded-t-xl sm:border-b-2 sm:-mb-[2px] ${
                        activeTab === 'events'
                            ? 'bg-white/5 text-white font-semibold sm:bg-transparent sm:border-primary'
                            : 'text-text-muted hover:text-white sm:bg-transparent sm:border-transparent'
                    }`}
                >
                    <Calendar className={`w-5 h-5 sm:w-4 sm:h-4 mb-1 sm:mb-0 shrink-0 transition-colors ${
                        activeTab === 'events' ? 'text-brand sm:text-white' : 'text-text-muted'
                    }`} />
                    <span className="text-[10px] sm:text-sm">Events</span>
                </button>
                <button
                    onClick={() => setActiveTab('hustles')}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all duration-200 cursor-pointer shrink-0 sm:flex-row sm:justify-start sm:py-3 sm:px-6 sm:text-sm sm:font-medium sm:rounded-none sm:rounded-t-xl sm:border-b-2 sm:-mb-[2px] ${
                        activeTab === 'hustles'
                            ? 'bg-white/5 text-white font-semibold sm:bg-transparent sm:border-primary'
                            : 'text-text-muted hover:text-white sm:bg-transparent sm:border-transparent'
                    }`}
                >
                    <Zap className={`w-5 h-5 sm:w-4 sm:h-4 mb-1 sm:mb-0 shrink-0 transition-colors ${
                        activeTab === 'hustles' ? 'text-brand sm:text-white' : 'text-text-muted'
                    }`} />
                    <span className="text-[10px] sm:text-sm">Hustles</span>
                </button>
                <button
                    onClick={() => setActiveTab('gigs')}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all duration-200 cursor-pointer shrink-0 sm:flex-row sm:justify-start sm:py-3 sm:px-6 sm:text-sm sm:font-medium sm:rounded-none sm:rounded-t-xl sm:border-b-2 sm:-mb-[2px] ${
                        activeTab === 'gigs'
                            ? 'bg-white/5 text-white font-semibold sm:bg-transparent sm:border-primary'
                            : 'text-text-muted hover:text-white sm:bg-transparent sm:border-transparent'
                    }`}
                >
                    <Briefcase className={`w-5 h-5 sm:w-4 sm:h-4 mb-1 sm:mb-0 shrink-0 transition-colors ${
                        activeTab === 'gigs' ? 'text-brand sm:text-white' : 'text-text-muted'
                    }`} />
                    <span className="text-[10px] sm:text-sm">Gigs</span>
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all duration-200 cursor-pointer shrink-0 sm:flex-row sm:justify-start sm:py-3 sm:px-6 sm:text-sm sm:font-medium sm:rounded-none sm:rounded-t-xl sm:border-b-2 sm:-mb-[2px] ${
                        activeTab === 'products'
                            ? 'bg-white/5 text-white font-semibold sm:bg-transparent sm:border-primary'
                            : 'text-text-muted hover:text-white sm:bg-transparent sm:border-transparent'
                    }`}
                >
                    <ShoppingBag className={`w-5 h-5 sm:w-4 sm:h-4 mb-1 sm:mb-0 shrink-0 transition-colors ${
                        activeTab === 'products' ? 'text-brand sm:text-white' : 'text-text-muted'
                    }`} />
                    <span className="text-[10px] sm:text-sm">Shop</span>
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'events' ? (
                <div className="space-y-6 animate-in">
                    {/* Stats Card */}
                    <div className="max-w-[280px]">
                        <Card hover className="p-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-purple-400/90">Total Events</span>
                                    <span className="text-purple-400 text-sm font-extrabold">{totalEvents}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-emerald-500/90">Approved</span>
                                    <span className="text-emerald-400 text-sm font-extrabold">{approvedEvents}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-amber-500/90">Pending</span>
                                    <span className="text-amber-400 text-sm font-extrabold">{pendingEvents}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Events List */}
                    <Card className="p-4 sm:p-6">
                        <CardHeader className="mb-2">
                            <CardTitle className="text-base font-bold text-white">Your Recent Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentEvents events={userEvents} />
                        </CardContent>
                    </Card>
                </div>
            ) : activeTab === 'hustles' ? (
                <div className="space-y-6 animate-in">
                    {/* Stats Card */}
                    <div className="max-w-[280px]">
                        <Card hover className="p-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-purple-400/90">Total Hustles</span>
                                    <span className="text-purple-400 text-sm font-extrabold">{totalHustles}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-emerald-500/90">Approved</span>
                                    <span className="text-emerald-400 text-sm font-extrabold">{approvedHustles}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-amber-500/90">Pending</span>
                                    <span className="text-amber-400 text-sm font-extrabold">{pendingHustles}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Hustles List */}
                    <Card className="p-4 sm:p-6">
                        <CardHeader className="mb-2">
                            <CardTitle className="text-base font-bold text-white">Your Recent Hustles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentHustles hustles={userHustles} />
                        </CardContent>
                    </Card>
                </div>
            ) : activeTab === 'gigs' ? (
                <div className="space-y-6 animate-in">
                    {/* Stats Card */}
                    <div className="max-w-[280px]">
                        <Card hover className="p-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-purple-400/90">Total Gigs</span>
                                    <span className="text-purple-400 text-sm font-extrabold">{totalGigs}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-emerald-500/90">Approved</span>
                                    <span className="text-emerald-400 text-sm font-extrabold">{approvedGigs}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-amber-500/90">Pending</span>
                                    <span className="text-amber-400 text-sm font-extrabold">{pendingGigs}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Gigs List */}
                    <Card className="p-4 sm:p-6">
                        <CardHeader className="mb-2">
                            <CardTitle className="text-base font-bold text-white">Your Recent Gigs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentGigs gigs={userGigs} />
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="space-y-6 animate-in">
                    {/* Stats Card */}
                    <div className="max-w-[280px]">
                        <Card hover className="p-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-purple-400/90">Total Products</span>
                                    <span className="text-purple-400 text-sm font-extrabold">{totalProducts}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-emerald-500/90">Approved</span>
                                    <span className="text-emerald-400 text-sm font-extrabold">{approvedProducts}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                                    <span className="text-amber-500/90">Pending</span>
                                    <span className="text-amber-400 text-sm font-extrabold">{pendingProducts}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Products List */}
                    <Card className="p-4 sm:p-6">
                        <CardHeader className="mb-2">
                            <CardTitle className="text-base font-bold text-white">Your Recent Listed Items</CardTitle>
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
