'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LinkifyText } from '@/components/ui/LinkifyText'
import { EventModerationActions } from '../events/EventModerationActions'
import { RecentlyApprovedEvents } from '../events/RecentlyApprovedEvents'
import { GigModerationActions } from './GigModerationActions'
import { RecentlyApprovedGigs } from './RecentlyApprovedGigs'
import { ProductModerationActions } from './ProductModerationActions'
import { RecentlyApprovedProducts } from './RecentlyApprovedProducts'
import { HustleModerationActions } from './HustleModerationActions'
import { RecentlyApprovedHustles } from './RecentlyApprovedHustles'
import { Calendar, Briefcase, ShoppingBag, Zap } from 'lucide-react'

interface Event {
    id: string
    title: string
    content: string
    createdAt: Date | string
    updatedAt: Date | string
    author: {
        name: string | null
        email: string
    }
    university: {
        name: string
        shortName: string
    }
}

interface Gig {
    id: string
    title: string
    description: string
    priceType: string
    minPrice: number | null
    maxPrice: number | null
    contactNo: string
    category: {
        name: string
    }
    createdAt: Date | string
    updatedAt: Date | string
    author: {
        name: string | null
        email: string
    }
    university: {
        shortName: string
    }
}

interface Product {
    id: string
    title: string
    description: string
    priceType: string
    price: number | null
    contactNo: string
    category: {
        name: string
    }
    createdAt: Date | string
    updatedAt: Date | string
    author: {
        name: string | null
        email: string
    }
    university: {
        shortName: string
    }
}

interface Hustle {
    id: string
    title: string
    description: string
    hustleType: string
    workMode: string
    priceType: string | null
    minPrice: number | null
    maxPrice: number | null
    contactNo: string | null
    category: {
        name: string
    }
    createdAt: Date | string
    updatedAt: Date | string
    author: {
        name: string | null
        email: string
    }
}

interface ModerationTabsProps {
    pendingEvents: Event[]
    recentApprovedEvents: Event[]
    eventStats: { pending: number; approved: number; total: number }
    pendingGigs: Gig[]
    recentApprovedGigs: Gig[]
    gigStats: { pending: number; approved: number; total: number }
    pendingProducts: Product[]
    recentApprovedProducts: Product[]
    productStats: { pending: number; approved: number; total: number }
    pendingHustles: Hustle[]
    recentApprovedHustles: Hustle[]
    hustleStats: { pending: number; approved: number; total: number }
}

interface ModerationTabButtonProps {
    tabId: 'events' | 'gigs' | 'products' | 'hustles'
    activeTab: 'events' | 'gigs' | 'products' | 'hustles'
    onClick: () => void
    label: string
    Icon: React.ComponentType<{ className?: string }>
}

function ModerationTabButton({
    tabId,
    activeTab,
    onClick,
    label,
    Icon,
}: ModerationTabButtonProps) {
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

export function ModerationTabs({
    pendingEvents,
    recentApprovedEvents,
    eventStats,
    pendingGigs,
    recentApprovedGigs,
    gigStats,
    pendingProducts,
    recentApprovedProducts,
    productStats,
    pendingHustles,
    recentApprovedHustles,
    hustleStats,
}: ModerationTabsProps) {
    const [activeTab, setActiveTab] = useState<'events' | 'gigs' | 'products' | 'hustles'>('events')

    const formatPrice = (gig: Gig) => {
        if (gig.priceType === 'NEGOTIABLE') return 'Negotiable'
        if (gig.priceType === 'FIXED') return `LKR ${gig.minPrice?.toLocaleString()}`
        return `LKR ${gig.minPrice?.toLocaleString()} - ${gig.maxPrice?.toLocaleString()}`
    }

    const formatProductPrice = (product: Product) => {
        if (product.priceType === 'NEGOTIABLE') return 'Negotiable'
        return `LKR ${product.price?.toLocaleString()}`
    }

    const formatHustleCompensation = (hustle: Hustle) => {
        if (!hustle.priceType) return 'Unpaid / Not specified'
        if (hustle.priceType === 'FIXED') return `LKR ${hustle.minPrice?.toLocaleString()}`
        return `LKR ${hustle.minPrice?.toLocaleString()} - ${hustle.maxPrice?.toLocaleString()}`
    }

    return (
        <div className="space-y-6">
            {/* Tabs Toggle */}
            <div className="flex items-center justify-around p-1.5 gap-1.5 max-w-4xl transition-all duration-300">
                <ModerationTabButton
                    tabId="events"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('events')}
                    label="Events"
                    Icon={Calendar}
                />
                <ModerationTabButton
                    tabId="gigs"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('gigs')}
                    label="Gigs"
                    Icon={Briefcase}
                />
                <ModerationTabButton
                    tabId="products"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('products')}
                    label="Shop"
                    Icon={ShoppingBag}
                />
                <ModerationTabButton
                    tabId="hustles"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('hustles')}
                    label="Hustles"
                    Icon={Zap}
                />
            </div>

            {/* Tab Contents */}
            {activeTab === 'events' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-in">
                    {/* Event Stats Sidebar */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="p-4 transition-all duration-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hover:bg-yellow-500/10 hover:border-yellow-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
                                        <span className="text-[10px] font-semibold text-yellow-200/90 tracking-wide">Pending Review</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-yellow-400">{eventStats.pending}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                        <span className="text-[10px] font-semibold text-emerald-200/90 tracking-wide">Approved</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-emerald-400">{eventStats.approved}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-purple-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                                        <span className="text-[10px] font-semibold text-purple-200/90 tracking-wide">Total Events</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-purple-400">{eventStats.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Events List */}
                    <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
                        <Card>
                            <CardHeader className="py-4">
                                <CardTitle className="text-base font-semibold">Pending Approval</CardTitle>
                                <CardDescription className="text-xs">Events awaiting moderation</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingEvents.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-text-dim text-xs">No events pending approval</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="p-4 sm:p-5 rounded-xl bg-surface border border-border border-l-4 border-l-yellow-500"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-base font-semibold text-white mb-1.5 truncate">
                                                            {event.title}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted mb-2">
                                                            <span>By {event.author.name || 'Unknown'}</span>
                                                            <span className="text-border/60">•</span>
                                                            <span className="truncate max-w-[150px] sm:max-w-none">{event.author.email}</span>
                                                            <span className="text-border/60">•</span>
                                                            <Badge variant="default" className="text-[9px] py-0 px-1.5 shrink-0">{event.university.shortName}</Badge>
                                                            <span className="text-border/60">•</span>
                                                            <span>
                                                                {new Date(event.createdAt).toLocaleString('en-US', {
                                                                    dateStyle: 'medium',
                                                                    timeStyle: 'short',
                                                                })}
                                                            </span>
                                                        </div>

                                                        <LinkifyText className="text-[12px] text-text-primary/95 whitespace-pre-wrap">
                                                            {event.content}
                                                        </LinkifyText>
                                                    </div>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-border/20">
                                                    <EventModerationActions eventId={event.id} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recently Approved Events */}
                        <RecentlyApprovedEvents events={recentApprovedEvents} />
                    </div>
                </div>
            ) : activeTab === 'gigs' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-in">
                    {/* Gig Stats Sidebar */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="p-4 transition-all duration-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hover:bg-yellow-500/10 hover:border-yellow-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
                                        <span className="text-[10px] font-semibold text-yellow-200/90 tracking-wide">Pending Review</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-yellow-400">{gigStats.pending}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                        <span className="text-[10px] font-semibold text-emerald-200/90 tracking-wide">Approved</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-emerald-400">{gigStats.approved}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-purple-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                                        <span className="text-[10px] font-semibold text-purple-200/90 tracking-wide">Total Gigs</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-purple-400">{gigStats.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Gigs List */}
                    <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
                        <Card>
                            <CardHeader className="py-4">
                                <CardTitle className="text-base font-semibold">Pending Approval</CardTitle>
                                <CardDescription className="text-xs">Gigs awaiting moderation</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingGigs.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-text-dim text-xs">No gigs pending approval</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingGigs.map((gig) => (
                                            <div
                                                key={gig.id}
                                                className="p-4 sm:p-5 rounded-xl bg-surface border border-border border-l-4 border-l-yellow-500"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
                                                            <h3 className="text-base font-semibold text-white truncate">
                                                                {gig.title}
                                                            </h3>
                                                            <Badge variant="default" className="text-[9px] py-0.5 px-1.5 bg-primary/20 text-accent font-semibold shrink-0">
                                                                {gig.category.name}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted mb-2">
                                                            <span>By {gig.author.name || 'Unknown'}</span>
                                                            <span className="text-border/60">•</span>
                                                            <span className="truncate max-w-[150px] sm:max-w-none">{gig.author.email}</span>
                                                            <span className="text-border/60">•</span>
                                                            <Badge variant="default" className="text-[9px] py-0 px-1.5 shrink-0">{gig.university.shortName}</Badge>
                                                            <span className="text-border/60">•</span>
                                                            <span>Contact: {gig.contactNo}</span>
                                                            <span className="text-border/60">•</span>
                                                            <span className="text-accent font-semibold">{formatPrice(gig)}</span>
                                                            <span className="text-border/60">•</span>
                                                            <span>
                                                                {new Date(gig.createdAt).toLocaleString('en-US', {
                                                                    dateStyle: 'medium',
                                                                    timeStyle: 'short',
                                                                })}
                                                            </span>
                                                        </div>

                                                        <LinkifyText className="text-[12px] text-text-primary/95 whitespace-pre-wrap">
                                                            {gig.description}
                                                        </LinkifyText>
                                                    </div>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-border/20">
                                                    <GigModerationActions gigId={gig.id} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recently Approved Gigs */}
                        <RecentlyApprovedGigs gigs={recentApprovedGigs} />
                    </div>
                </div>
            ) : activeTab === 'products' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-in">
                    {/* Product Stats Sidebar */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="p-4 transition-all duration-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hover:bg-yellow-500/10 hover:border-yellow-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
                                        <span className="text-[10px] font-semibold text-yellow-200/90 tracking-wide">Pending Review</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-yellow-400">{productStats.pending}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                        <span className="text-[10px] font-semibold text-emerald-200/90 tracking-wide">Approved</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-emerald-400">{productStats.approved}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-purple-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                                        <span className="text-[10px] font-semibold text-purple-200/90 tracking-wide">Total Items</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-purple-400">{productStats.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Products List */}
                    <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
                        <Card>
                            <CardHeader className="py-4">
                                <CardTitle className="text-base font-semibold">Pending Approval</CardTitle>
                                <CardDescription className="text-xs">Shop items awaiting moderation</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingProducts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-text-dim text-xs">No items pending approval</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="p-4 sm:p-5 rounded-xl bg-surface border border-border border-l-4 border-l-yellow-500"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
                                                            <h3 className="text-base font-semibold text-white truncate">
                                                                {product.title}
                                                            </h3>
                                                            <Badge variant="default" className="text-[9px] py-0.5 px-1.5 bg-primary/20 text-accent font-semibold shrink-0">
                                                                {product.category.name}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted mb-2">
                                                            <span>By {product.author.name || 'Unknown'}</span>
                                                            <span className="text-border/60">•</span>
                                                            <span className="truncate max-w-[150px] sm:max-w-none">{product.author.email}</span>
                                                            <span className="text-border/60">•</span>
                                                            <Badge variant="default" className="text-[9px] py-0 px-1.5 shrink-0">{product.university.shortName}</Badge>
                                                            <span className="text-border/60">•</span>
                                                            <span>Contact: {product.contactNo}</span>
                                                            <span className="text-border/60">•</span>
                                                            <span className="text-accent font-semibold">{formatProductPrice(product)}</span>
                                                            <span className="text-border/60">•</span>
                                                            <span>
                                                                {new Date(product.createdAt).toLocaleString('en-US', {
                                                                    dateStyle: 'medium',
                                                                    timeStyle: 'short',
                                                                })}
                                                            </span>
                                                        </div>

                                                        <LinkifyText className="text-[12px] text-text-primary/95 whitespace-pre-wrap">
                                                            {product.description}
                                                        </LinkifyText>
                                                    </div>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-border/20">
                                                    <ProductModerationActions productId={product.id} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recently Approved Products */}
                        <RecentlyApprovedProducts products={recentApprovedProducts} />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-in">
                    {/* Hustle Stats Sidebar */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="p-4 transition-all duration-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hover:bg-yellow-500/10 hover:border-yellow-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
                                        <span className="text-[10px] font-semibold text-yellow-200/90 tracking-wide">Pending Review</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-yellow-400">{hustleStats.pending}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                        <span className="text-[10px] font-semibold text-emerald-200/90 tracking-wide">Approved</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-emerald-400">{hustleStats.approved}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-purple-500/25 transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                                        <span className="text-[10px] font-semibold text-purple-200/90 tracking-wide">Total Hustles</span>
                                    </div>
                                    <span className="text-xs font-extrabold text-purple-400">{hustleStats.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Hustles List */}
                    <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
                        <Card>
                            <CardHeader className="py-4">
                                <CardTitle className="text-base font-semibold">Pending Approval</CardTitle>
                                <CardDescription className="text-xs">Hustle jobs awaiting moderation</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingHustles.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-text-dim text-xs">No opportunities pending approval</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingHustles.map((hustle) => (
                                            <div
                                                key={hustle.id}
                                                className="p-4 sm:p-5 rounded-xl bg-surface border border-border border-l-4 border-l-yellow-500"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
                                                            <h3 className="text-base font-semibold text-white truncate">
                                                                {hustle.title}
                                                            </h3>
                                                            <div className="flex items-center gap-1 flex-wrap shrink-0">
                                                                <Badge variant="default" className="text-[9px] py-0.5 px-1.5 bg-primary/20 text-accent font-semibold">
                                                                    {hustle.category.name}
                                                                </Badge>
                                                                <Badge variant="info" className="text-[8px] py-0 px-1 uppercase font-bold shrink-0">
                                                                    {hustle.hustleType.replace('_', ' ')}
                                                                </Badge>
                                                                <Badge variant="success" className="text-[8px] py-0 px-1 uppercase font-bold shrink-0">
                                                                    {hustle.workMode.replace('_', ' ')}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted mb-2">
                                                            <span>By {hustle.author.name || 'Unknown'}</span>
                                                            <span className="text-border/60">•</span>
                                                            <span className="truncate max-w-[150px] sm:max-w-none">{hustle.author.email}</span>
                                                            <span className="text-border/60">•</span>

                                                            {hustle.contactNo && (
                                                                <>
                                                                    <span>Contact: {hustle.contactNo}</span>
                                                                    <span className="text-border/60">•</span>
                                                                </>
                                                            )}
                                                            <span className="text-green-400 font-semibold">{formatHustleCompensation(hustle)}</span>
                                                            <span className="text-border/60">•</span>
                                                            <span>
                                                                {new Date(hustle.createdAt).toLocaleString('en-US', {
                                                                    dateStyle: 'medium',
                                                                    timeStyle: 'short',
                                                                })}
                                                            </span>
                                                        </div>

                                                        <LinkifyText className="text-[12px] text-text-primary/95 whitespace-pre-wrap">
                                                            {hustle.description}
                                                        </LinkifyText>
                                                    </div>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-border/20">
                                                    <HustleModerationActions hustleId={hustle.id} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recently Approved Hustles */}
                        <RecentlyApprovedHustles hustles={recentApprovedHustles} />
                    </div>
                </div>
            )}
        </div>
    )
}
