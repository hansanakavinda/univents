'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { RecentEvents } from '@/app/(main)/dashboard/RecentEvents'
import { RecentGigs } from '@/app/(main)/dashboard/RecentGigs'
import { RecentProducts } from '@/app/(main)/dashboard/RecentProducts'
import { RecentHustles } from '@/app/(main)/dashboard/RecentHustles'

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
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'events'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    📅 My Events ({totalEvents})
                </button>
                <button
                    onClick={() => setActiveTab('gigs')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'gigs'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    💼 My Gigs ({totalGigs})
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'products'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    🛍️ My Products ({totalProducts})
                </button>
                <button
                    onClick={() => setActiveTab('hustles')}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                        activeTab === 'hustles'
                            ? 'border-primary text-white'
                            : 'border-transparent text-text-muted hover:text-white'
                    }`}
                >
                    ⚡ My Hustles ({totalHustles})
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'events' ? (
                <div className="space-y-6 animate-in">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Events</CardDescription>
                                <CardTitle className="text-4xl text-accent">{totalEvents}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">All your submitted events</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardDescription>Approved</CardDescription>
                                <CardTitle className="text-4xl text-green-400">{approvedEvents}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">Visible to the public</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardDescription>Pending Approval</CardDescription>
                                <CardTitle className="text-4xl text-yellow-400">{pendingEvents}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">Awaiting moderation</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Events List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Recent Events</CardTitle>
                            <CardDescription>Your latest submissions and their status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentEvents events={userEvents} />
                        </CardContent>
                    </Card>
                </div>
            ) : activeTab === 'gigs' ? (
                <div className="space-y-6 animate-in">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Gigs</CardDescription>
                                <CardTitle className="text-4xl text-accent">{totalGigs}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">All your submitted gigs</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardDescription>Approved</CardDescription>
                                <CardTitle className="text-4xl text-green-400">{approvedGigs}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">Visible to the public</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardDescription>Pending Approval</CardDescription>
                                <CardTitle className="text-4xl text-yellow-400">{pendingGigs}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">Awaiting moderation</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Gigs List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Recent Gigs</CardTitle>
                            <CardDescription>Your latest submissions and their status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentGigs gigs={userGigs} />
                        </CardContent>
                    </Card>
                </div>
            ) : activeTab === 'products' ? (
                <div className="space-y-6 animate-in">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Products</CardDescription>
                                <CardTitle className="text-4xl text-accent">{totalProducts}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">All your listed items</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardDescription>Approved</CardDescription>
                                <CardTitle className="text-4xl text-green-400">{approvedProducts}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">Visible to the public</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardDescription>Pending Approval</CardDescription>
                                <CardTitle className="text-4xl text-yellow-400">{pendingProducts}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">Awaiting moderation</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Products List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Recent Listed Items</CardTitle>
                            <CardDescription>Your latest items and their moderation status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentProducts products={userProducts} />
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="space-y-6 animate-in">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardDescription>Total Hustles</CardDescription>
                                <CardTitle className="text-4xl text-accent">{totalHustles}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">All your listed opportunities</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardDescription>Approved</CardDescription>
                                <CardTitle className="text-4xl text-green-400">{approvedHustles}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">Visible to the public</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardDescription>Pending Approval</CardDescription>
                                <CardTitle className="text-4xl text-yellow-400">{pendingHustles}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-text-muted">Awaiting moderation</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Hustles List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Recent Hustles</CardTitle>
                            <CardDescription>Your latest listed opportunities and their status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentHustles hustles={userHustles} />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
