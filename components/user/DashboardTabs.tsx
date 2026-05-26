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

interface DashboardSectionPanelProps {
    totalLabel: string
    totalValue: number
    approvedValue: number
    pendingValue: number
    listTitle: string
    children: React.ReactNode
}

function DashboardSectionPanel({
    totalLabel,
    totalValue,
    approvedValue,
    pendingValue,
    listTitle,
    children,
}: DashboardSectionPanelProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start animate-in">
            {/* Stats Card */}
            <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="p-4 transition-all duration-300">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-purple-500/25 transition-all duration-200">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                                <span className="text-xs font-semibold text-purple-200/90 tracking-wide">{totalLabel}</span>
                            </div>
                            <span className="text-sm font-extrabold text-purple-400">{totalValue}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all duration-200">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                                <span className="text-xs font-semibold text-emerald-200/90 tracking-wide">Approved</span>
                            </div>
                            <span className="text-sm font-extrabold text-emerald-400">{approvedValue}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 hover:border-amber-500/25 transition-all duration-200">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                                <span className="text-xs font-semibold text-amber-200/90 tracking-wide">Pending</span>
                            </div>
                            <span className="text-sm font-extrabold text-amber-400">{pendingValue}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Items List */}
            <div className="lg:col-span-3 order-2 lg:order-1  p-4 sm:p-6 ">
                <div className="mb-4">
                    <h3 className="text-base font-bold text-white">{listTitle}</h3>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

interface DashboardTabButtonProps {
    tabId: 'events' | 'gigs' | 'products' | 'hustles'
    activeTab: 'events' | 'gigs' | 'products' | 'hustles'
    onClick: () => void
    label: string
    Icon: React.ComponentType<{ className?: string }>
}

function DashboardTabButton({
    tabId,
    activeTab,
    onClick,
    label,
    Icon,
}: DashboardTabButtonProps) {
    const isActive = activeTab === tabId
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all duration-300 cursor-pointer shrink-0 sm:flex-row sm:gap-2 sm:py-2.5 sm:px-5 sm:text-sm sm:font-semibold ${
                isActive
                    ? 'bg-primary/25 border border-primary/45 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                    : 'border border-transparent text-text-muted hover:text-white hover:bg-white/5'
            }`}
        >
            <Icon className={`w-5 h-5 sm:w-4 sm:h-4 mb-1 sm:mb-0 shrink-0 transition-colors ${
                isActive ? 'text-accent' : 'text-text-muted'
            }`} />
            <span className="text-[10px] sm:text-sm">{label}</span>
        </button>
    )
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
            <div className="flex items-center justify-around p-1.5 gap-1.5 max-w-2xl transition-all duration-300">
                <DashboardTabButton
                    tabId="events"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('events')}
                    label="Events"
                    Icon={Calendar}
                />
                <DashboardTabButton
                    tabId="hustles"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('hustles')}
                    label="Hustles"
                    Icon={Zap}
                />
                <DashboardTabButton
                    tabId="gigs"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('gigs')}
                    label="Gigs"
                    Icon={Briefcase}
                />
                <DashboardTabButton
                    tabId="products"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('products')}
                    label="Shop"
                    Icon={ShoppingBag}
                />
            </div>

            {/* Tab Contents */}
            {activeTab === 'events' ? (
                <DashboardSectionPanel
                    totalLabel="Total Events"
                    totalValue={totalEvents}
                    approvedValue={approvedEvents}
                    pendingValue={pendingEvents}
                    listTitle="Your Recent Events"
                >
                    <RecentEvents events={userEvents} />
                </DashboardSectionPanel>
            ) : activeTab === 'hustles' ? (
                <DashboardSectionPanel
                    totalLabel="Total Hustles"
                    totalValue={totalHustles}
                    approvedValue={approvedHustles}
                    pendingValue={pendingHustles}
                    listTitle="Your Recent Hustles"
                >
                    <RecentHustles hustles={userHustles} />
                </DashboardSectionPanel>
            ) : activeTab === 'gigs' ? (
                <DashboardSectionPanel
                    totalLabel="Total Gigs"
                    totalValue={totalGigs}
                    approvedValue={approvedGigs}
                    pendingValue={pendingGigs}
                    listTitle="Your Recent Gigs"
                >
                    <RecentGigs gigs={userGigs} />
                </DashboardSectionPanel>
            ) : (
                <DashboardSectionPanel
                    totalLabel="Total Products"
                    totalValue={totalProducts}
                    approvedValue={approvedProducts}
                    pendingValue={pendingProducts}
                    listTitle="Your Recent Listed Items"
                >
                    <RecentProducts products={userProducts} />
                </DashboardSectionPanel>
            )}
        </div>
    )
}
