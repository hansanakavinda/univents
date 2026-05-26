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
            <div className="flex items-center justify-around bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 gap-1.5 shadow-lg max-w-2xl hover:border-white/15 transition-all duration-300">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all duration-300 cursor-pointer shrink-0 sm:flex-row sm:gap-2 sm:py-2.5 sm:px-5 sm:text-sm sm:font-semibold ${
                        activeTab === 'events'
                            ? 'bg-primary/25 border border-primary/45 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                            : 'border border-transparent text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Calendar className={`w-5 h-5 sm:w-4 sm:h-4 mb-1 sm:mb-0 shrink-0 transition-colors ${
                        activeTab === 'events' ? 'text-accent' : 'text-text-muted'
                    }`} />
                    <span className="text-[10px] sm:text-sm">Events</span>
                </button>
                <button
                    onClick={() => setActiveTab('hustles')}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all duration-300 cursor-pointer shrink-0 sm:flex-row sm:gap-2 sm:py-2.5 sm:px-5 sm:text-sm sm:font-semibold ${
                        activeTab === 'hustles'
                            ? 'bg-primary/25 border border-primary/45 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                            : 'border border-transparent text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Zap className={`w-5 h-5 sm:w-4 sm:h-4 mb-1 sm:mb-0 shrink-0 transition-colors ${
                        activeTab === 'hustles' ? 'text-accent' : 'text-text-muted'
                    }`} />
                    <span className="text-[10px] sm:text-sm">Hustles</span>
                </button>
                <button
                    onClick={() => setActiveTab('gigs')}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all duration-300 cursor-pointer shrink-0 sm:flex-row sm:gap-2 sm:py-2.5 sm:px-5 sm:text-sm sm:font-semibold ${
                        activeTab === 'gigs'
                            ? 'bg-primary/25 border border-primary/45 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                            : 'border border-transparent text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Briefcase className={`w-5 h-5 sm:w-4 sm:h-4 mb-1 sm:mb-0 shrink-0 transition-colors ${
                        activeTab === 'gigs' ? 'text-accent' : 'text-text-muted'
                    }`} />
                    <span className="text-[10px] sm:text-sm">Gigs</span>
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all duration-300 cursor-pointer shrink-0 sm:flex-row sm:gap-2 sm:py-2.5 sm:px-5 sm:text-sm sm:font-semibold ${
                        activeTab === 'products'
                            ? 'bg-primary/25 border border-primary/45 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                            : 'border border-transparent text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    <ShoppingBag className={`w-5 h-5 sm:w-4 sm:h-4 mb-1 sm:mb-0 shrink-0 transition-colors ${
                        activeTab === 'products' ? 'text-accent' : 'text-text-muted'
                    }`} />
                    <span className="text-[10px] sm:text-sm">Shop</span>
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'events' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-in">
                    {/* Stats Card */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg hover:border-primary/30 transition-all duration-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-purple-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                                        <span className="text-xs font-semibold text-purple-200/90 tracking-wide">Total Events</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-purple-400">{totalEvents}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                        <span className="text-xs font-semibold text-emerald-200/90 tracking-wide">Approved</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-emerald-400">{approvedEvents}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 hover:border-amber-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                                        <span className="text-xs font-semibold text-amber-200/90 tracking-wide">Pending</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-amber-400">{pendingEvents}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Events List */}
                    <div className="lg:col-span-3 order-2 lg:order-1 bg-black/25 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                        <div className="mb-4">
                            <h3 className="text-base font-bold text-white">Your Recent Events</h3>
                        </div>
                        <div>
                            <RecentEvents events={userEvents} />
                        </div>
                    </div>
                </div>
            ) : activeTab === 'hustles' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-in">
                    {/* Stats Card */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg hover:border-primary/30 transition-all duration-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-purple-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                                        <span className="text-xs font-semibold text-purple-200/90 tracking-wide">Total Hustles</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-purple-400">{totalHustles}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                        <span className="text-xs font-semibold text-emerald-200/90 tracking-wide">Approved</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-emerald-400">{approvedHustles}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 hover:border-amber-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                                        <span className="text-xs font-semibold text-amber-200/90 tracking-wide">Pending</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-amber-400">{pendingHustles}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Hustles List */}
                    <div className="lg:col-span-3 order-2 lg:order-1 bg-black/25 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                        <div className="mb-4">
                            <h3 className="text-base font-bold text-white">Your Recent Hustles</h3>
                        </div>
                        <div>
                            <RecentHustles hustles={userHustles} />
                        </div>
                    </div>
                </div>
            ) : activeTab === 'gigs' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-in">
                    {/* Stats Card */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg hover:border-primary/30 transition-all duration-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-purple-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                                        <span className="text-xs font-semibold text-purple-200/90 tracking-wide">Total Gigs</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-purple-400">{totalGigs}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                        <span className="text-xs font-semibold text-emerald-200/90 tracking-wide">Approved</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-emerald-400">{approvedGigs}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 hover:border-amber-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                                        <span className="text-xs font-semibold text-amber-200/90 tracking-wide">Pending</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-amber-400">{pendingGigs}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Gigs List */}
                    <div className="lg:col-span-3 order-2 lg:order-1 bg-black/25 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                        <div className="mb-4">
                            <h3 className="text-base font-bold text-white">Your Recent Gigs</h3>
                        </div>
                        <div>
                            <RecentGigs gigs={userGigs} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-in">
                    {/* Stats Card */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg hover:border-primary/30 transition-all duration-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-purple-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                                        <span className="text-xs font-semibold text-purple-200/90 tracking-wide">Total Products</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-purple-400">{totalProducts}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                        <span className="text-xs font-semibold text-emerald-200/90 tracking-wide">Approved</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-emerald-400">{approvedProducts}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 hover:border-amber-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                                        <span className="text-xs font-semibold text-amber-200/90 tracking-wide">Pending</span>
                                    </div>
                                    <span className="text-sm font-extrabold text-amber-400">{pendingProducts}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Products List */}
                    <div className="lg:col-span-3 order-2 lg:order-1 bg-black/25 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                        <div className="mb-4">
                            <h3 className="text-base font-bold text-white">Your Recent Listed Items</h3>
                        </div>
                        <div>
                            <RecentProducts products={userProducts} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
