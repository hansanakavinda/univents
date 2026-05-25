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
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'events'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    📅 Events Moderation ({pendingEvents.length})
                </button>
                <button
                    onClick={() => setActiveTab('gigs')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'gigs'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    💼 Gigs Moderation ({pendingGigs.length})
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'products'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    🛍️ Products Moderation ({pendingProducts.length})
                </button>
                <button
                    onClick={() => setActiveTab('hustles')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'hustles'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    ⚡ Hustles Moderation ({pendingHustles.length})
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'events' ? (
                <div className="space-y-6 animate-in">
                    {/* Event Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardDescription>Pending Review</CardDescription>
                                <CardTitle className="text-4xl text-yellow-400">{eventStats.pending}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Approved</CardDescription>
                                <CardTitle className="text-4xl text-green-400">{eventStats.approved}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Events</CardDescription>
                                <CardTitle className="text-4xl text-accent">{eventStats.total}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Pending Events List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Approval</CardTitle>
                            <CardDescription>Events awaiting moderation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingEvents.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-text-dim">No events pending approval</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="p-6 rounded-xl bg-surface border border-border border-l-4 border-l-yellow-500"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-white mb-2">
                                                        {event.title}
                                                    </h3>
                                                    <div className="flex items-center flex-wrap gap-2 text-sm text-text-muted mb-3">
                                                        <span>By {event.author.name || 'Unknown'}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>{event.author.email}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <Badge variant="default">{event.university.shortName}</Badge>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>
                                                            {new Date(event.createdAt).toLocaleString('en-US', {
                                                                dateStyle: 'medium',
                                                                timeStyle: 'short',
                                                            })}
                                                        </span>
                                                    </div>

                                                    <LinkifyText className="text-text-primary whitespace-pre-wrap">
                                                        {event.content}
                                                    </LinkifyText>
                                                </div>
                                            </div>
                                            <EventModerationActions eventId={event.id} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recently Approved Events */}
                    <RecentlyApprovedEvents events={recentApprovedEvents} />
                </div>
            ) : activeTab === 'gigs' ? (
                <div className="space-y-6 animate-in">
                    {/* Gig Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardDescription>Pending Review</CardDescription>
                                <CardTitle className="text-4xl text-yellow-400">{gigStats.pending}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Approved</CardDescription>
                                <CardTitle className="text-4xl text-green-400">{gigStats.approved}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Gigs</CardDescription>
                                <CardTitle className="text-4xl text-accent">{gigStats.total}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Pending Gigs List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Approval</CardTitle>
                            <CardDescription>Gigs awaiting moderation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingGigs.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-text-dim">No gigs pending approval</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingGigs.map((gig) => (
                                        <div
                                            key={gig.id}
                                            className="p-6 rounded-xl bg-surface border border-border border-l-4 border-l-yellow-500"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="text-xl font-semibold text-white">
                                                            {gig.title}
                                                        </h3>
                                                        <Badge variant="default" className="bg-primary/20 text-accent font-semibold">
                                                            {gig.category.name}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center flex-wrap gap-2 text-sm text-text-muted mb-3">
                                                        <span>By {gig.author.name || 'Unknown'}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>{gig.author.email}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <Badge variant="default">{gig.university.shortName}</Badge>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>Contact: {gig.contactNo}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span className="text-accent font-semibold">{formatPrice(gig)}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>
                                                            {new Date(gig.createdAt).toLocaleString('en-US', {
                                                                dateStyle: 'medium',
                                                                timeStyle: 'short',
                                                            })}
                                                        </span>
                                                    </div>

                                                    <LinkifyText className="text-text-primary whitespace-pre-wrap">
                                                        {gig.description}
                                                    </LinkifyText>
                                                </div>
                                            </div>
                                            <GigModerationActions gigId={gig.id} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recently Approved Gigs */}
                    <RecentlyApprovedGigs gigs={recentApprovedGigs} />
                </div>
            ) : activeTab === 'products' ? (
                <div className="space-y-6 animate-in">
                    {/* Product Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardDescription>Pending Review</CardDescription>
                                <CardTitle className="text-4xl text-yellow-400">{productStats.pending}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Approved</CardDescription>
                                <CardTitle className="text-4xl text-green-400">{productStats.approved}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Items</CardDescription>
                                <CardTitle className="text-4xl text-accent">{productStats.total}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Pending Products List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Approval</CardTitle>
                            <CardDescription>Shop items awaiting moderation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-text-dim">No items pending approval</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="p-6 rounded-xl bg-surface border border-border border-l-4 border-l-yellow-500"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="text-xl font-semibold text-white">
                                                            {product.title}
                                                        </h3>
                                                        <Badge variant="default" className="bg-primary/20 text-accent font-semibold">
                                                            {product.category.name}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center flex-wrap gap-2 text-sm text-text-muted mb-3">
                                                        <span>By {product.author.name || 'Unknown'}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>{product.author.email}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <Badge variant="default">{product.university.shortName}</Badge>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>Contact: {product.contactNo}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span className="text-accent font-semibold">{formatProductPrice(product)}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>
                                                            {new Date(product.createdAt).toLocaleString('en-US', {
                                                                dateStyle: 'medium',
                                                                timeStyle: 'short',
                                                            })}
                                                        </span>
                                                    </div>

                                                    <LinkifyText className="text-text-primary whitespace-pre-wrap">
                                                        {product.description}
                                                    </LinkifyText>
                                                </div>
                                            </div>
                                            <ProductModerationActions productId={product.id} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recently Approved Products */}
                    <RecentlyApprovedProducts products={recentApprovedProducts} />
                </div>
            ) : (
                <div className="space-y-6 animate-in">
                    {/* Hustle Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardDescription>Pending Review</CardDescription>
                                <CardTitle className="text-4xl text-yellow-400">{hustleStats.pending}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Approved</CardDescription>
                                <CardTitle className="text-4xl text-green-400">{hustleStats.approved}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Opportunities</CardDescription>
                                <CardTitle className="text-4xl text-accent">{hustleStats.total}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Pending Hustles List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Approval</CardTitle>
                            <CardDescription>Hustle jobs awaiting moderation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingHustles.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-text-dim">No opportunities pending approval</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingHustles.map((hustle) => (
                                        <div
                                            key={hustle.id}
                                            className="p-6 rounded-xl bg-surface border border-border border-l-4 border-l-yellow-500"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="text-xl font-semibold text-white">
                                                            {hustle.title}
                                                        </h3>
                                                        <div className="flex items-center gap-1.5">
                                                            <Badge variant="default" className="bg-primary/20 text-accent font-semibold">
                                                                {hustle.category.name}
                                                            </Badge>
                                                            <Badge variant="info" className="text-[9px] py-0.5 uppercase font-bold">
                                                                {hustle.hustleType.replace('_', ' ')}
                                                            </Badge>
                                                            <Badge variant="success" className="text-[9px] py-0.5 uppercase font-bold">
                                                                {hustle.workMode.replace('_', ' ')}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center flex-wrap gap-2 text-sm text-text-muted mb-3">
                                                        <span>By {hustle.author.name || 'Unknown'}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>{hustle.author.email}</span>
                                                        <span className="hidden sm:inline">•</span>

                                                        {hustle.contactNo && (
                                                            <>
                                                                <span>Contact: {hustle.contactNo}</span>
                                                                <span className="hidden sm:inline">•</span>
                                                            </>
                                                        )}
                                                        <span className="text-green-400 font-semibold">{formatHustleCompensation(hustle)}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>
                                                            {new Date(hustle.createdAt).toLocaleString('en-US', {
                                                                dateStyle: 'medium',
                                                                timeStyle: 'short',
                                                            })}
                                                        </span>
                                                    </div>

                                                    <LinkifyText className="text-text-primary whitespace-pre-wrap">
                                                        {hustle.description}
                                                    </LinkifyText>
                                                </div>
                                            </div>
                                            <HustleModerationActions hustleId={hustle.id} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recently Approved Hustles */}
                    <RecentlyApprovedHustles hustles={recentApprovedHustles} />
                </div>
            )}
        </div>
    )
}
