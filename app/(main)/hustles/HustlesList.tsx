'use client'

import { useState, useEffect, useCallback } from 'react'
import { EventCard, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { LinkifyText } from '@/components/ui/LinkifyText'
import Image from 'next/image'
import Link from 'next/link'
import { Hustle } from '@/types/hustle'

interface Category {
    id: string
    name: string
}

interface HustlesListProps {
    initialHustles: Hustle[]
    categories: Category[]
}

export function HustlesList({
    initialHustles,
    categories,
}: HustlesListProps) {
    const toast = useToast()
    const [hustles, setHustles] = useState<Hustle[]>(initialHustles)
    const [isLoading, setIsLoading] = useState(false)
    const [isFiltering, setIsFiltering] = useState(false)
    const [hasMore, setHasMore] = useState(initialHustles.length >= 8)

    // Filters
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const [selectedHustleType, setSelectedHustleType] = useState('')
    const [selectedWorkMode, setSelectedWorkMode] = useState('')

    // Selected Contact Hustle
    const [contactHustle, setContactHustle] = useState<Hustle | null>(null)

    // Expanded descriptions
    const [expandedHustles, setExpandedHustles] = useState<Set<string>>(new Set())

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    const toggleExpand = (hustleId: string) => {
        setExpandedHustles((prev) => {
            const next = new Set(prev)
            if (next.has(hustleId)) {
                next.delete(hustleId)
            } else {
                next.add(hustleId)
            }
            return next
        })
    }

    const buildFetchUrl = useCallback((skip: number) => {
        const params = new URLSearchParams({
            take: '8',
            skip: String(skip),
        })
        if (debouncedSearch) params.set('search', debouncedSearch)
        if (selectedCategoryId) params.set('categoryId', selectedCategoryId)
        if (selectedHustleType) params.set('hustleType', selectedHustleType)
        if (selectedWorkMode) params.set('workMode', selectedWorkMode)
        return `/api/hustles/list?${params.toString()}`
    }, [debouncedSearch, selectedCategoryId, selectedHustleType, selectedWorkMode])

    // Fetch filtered hustles when filters change
    useEffect(() => {
        const fetchFiltered = async () => {
            setIsFiltering(true)
            try {
                const response = await fetch(buildFetchUrl(0))
                const data = await response.json()
                if (data.hustles) {
                    setHustles(data.hustles)
                    setHasMore(data.hustles.length >= 8)
                }
            } catch (err) {
                console.error('Failed to fetch filtered hustles:', err)
            } finally {
                setIsFiltering(false)
            }
        }
        fetchFiltered()
    }, [debouncedSearch, selectedCategoryId, selectedHustleType, selectedWorkMode, buildFetchUrl])

    const handleLoadMore = async () => {
        if (isLoading || !hasMore) return
        setIsLoading(true)
        try {
            const response = await fetch(buildFetchUrl(hustles.length))
            const data = await response.json()
            if (data.hustles) {
                setHustles((prev) => [...prev, ...data.hustles])
                setHasMore(data.hustles.length >= 8)
            }
        } catch (err) {
            console.error('Failed to load more hustles:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const formatCompensation = (hustle: Hustle) => {
        if (!hustle.priceType) return 'Unpaid / Not specified'
        if (hustle.priceType === 'FIXED') return `LKR ${hustle.minPrice?.toLocaleString()}`
        return `LKR ${hustle.minPrice?.toLocaleString()} - ${hustle.maxPrice?.toLocaleString()}`
    }

    const formatBadgeText = (text: string) => {
        return text.replace('_', ' ').toLowerCase()
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Contact info copied!')
    }

    const getContactLink = (contact: string) => {
        if (contact.startsWith('http')) return contact
        if (contact.includes('@')) return `mailto:${contact}`
        return `tel:${contact}`
    }

    const getContactLabel = (contact: string) => {
        if (contact.startsWith('http')) return '🔗 Apply Online'
        if (contact.includes('@')) return '✉️ Email Employer'
        return '📞 Call Employer'
    }

    const formatWhatsappUrl = (contact: string, title: string) => {
        if (contact.startsWith('http')) return contact
        const cleanNo = contact.replace(/\D/g, '')
        const formattedNo = cleanNo.startsWith('0') ? '94' + cleanNo.substring(1) : cleanNo
        return `https://wa.me/${formattedNo}?text=Hi! I saw your opportunity "${encodeURIComponent(title)}" on Univents and I'm interested.`
    }



    const hustleTypeOptions = [
        { value: 'INTERNSHIP', label: 'Internship' },
        { value: 'FREELANCE', label: 'Freelance' },
        { value: 'PART_TIME', label: 'Part-Time' },
        { value: 'ONE_TIME', label: 'One-Time Task' },
    ]

    const workModeOptions = [
        { value: 'REMOTE', label: 'Remote' },
        { value: 'ON_SITE', label: 'On-site' },
        { value: 'HYBRID', label: 'Hybrid' },
    ]

    return (
        <div className="space-y-6">
            {/* Filter Controls */}
            <div className="mb-8 mt-2 flex flex-col items-center gap-4 sticky top-[88px] z-30 px-4 md:px-0">
                <div className="relative z-40 flex flex-col md:flex-row items-center gap-1.5 p-1.5 rounded-[1.25rem] md:rounded-full bg-surface/70 backdrop-blur-xl border border-white/10 shadow-xl w-full max-w-5xl">
                    {/* Search */}
                    <div className="flex-1 w-full relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
                        <input
                            type="text"
                            placeholder="Search side hustles, internships, or job posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 text-sm bg-transparent border-0 ring-0 focus:outline-none focus:ring-0 text-white placeholder:text-text-dim rounded-full hover:bg-white/5 transition-colors"
                        />
                    </div>



                    <div className="hidden md:block w-px h-6 bg-white/10 mx-1"></div>
                    <div className="block md:hidden w-full h-px bg-white/10 my-1"></div>

                    {/* Hustle Type Filter */}
                    <div className="w-full md:w-auto md:min-w-[150px] relative z-20">
                        <Dropdown
                            options={hustleTypeOptions}
                            value={selectedHustleType}
                            onChange={setSelectedHustleType}
                            placeholder="Hustle Type"
                            className="w-full [&>button]:!bg-transparent [&>button]:!border-0 [&>button]:!shadow-none [&>button]:!ring-0 hover:[&>button]:!bg-white/5 [&>button]:!rounded-full [&>button]:transition-colors"
                        />
                    </div>

                    <div className="hidden md:block w-px h-6 bg-white/10 mx-1"></div>
                    <div className="block md:hidden w-full h-px bg-white/10 my-1"></div>

                    {/* Work Mode Filter */}
                    <div className="w-full md:w-auto md:min-w-[150px] relative z-10">
                        <Dropdown
                            options={workModeOptions}
                            value={selectedWorkMode}
                            onChange={setSelectedWorkMode}
                            placeholder="Work Mode"
                            className="w-full [&>button]:!bg-transparent [&>button]:!border-0 [&>button]:!shadow-none [&>button]:!ring-0 hover:[&>button]:!bg-white/5 [&>button]:!rounded-full [&>button]:transition-colors"
                        />
                    </div>
                </div>

                {/* Category Tags */}
                <div className="relative z-10 flex flex-wrap justify-center gap-2 max-w-4xl">
                    <button
                        onClick={() => setSelectedCategoryId('')}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                            selectedCategoryId === ''
                                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                                : 'border-border bg-surface/30 backdrop-blur-md text-text-muted hover:text-white hover:bg-white/5'
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                                selectedCategoryId === cat.id
                                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                                    : 'border-border bg-surface/30 backdrop-blur-md text-text-muted hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hustles List Section */}
            {isFiltering ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-text-muted">Filtering opportunities...</p>
                </div>
            ) : hustles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-card rounded-2xl border border-border text-center p-6">
                    <svg className="w-16 h-16 text-text-dim mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">No Hustles Found</h3>
                    <p className="text-text-muted max-w-md mb-6">Be the first to post a side hustle, internship, or part-time job to help undergraduates earn and learn!</p>
                    <Link
                        href="/hustles/create"
                        className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
                    >
                        Post a Hustle
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Hustles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hustles.map((hustle, index) => {
                            const isExpanded = expandedHustles.has(hustle.id)

                            return (
                                <EventCard key={hustle.id} hover className={`w-full flex flex-col relative overflow-hidden transition-all duration-300 ${isExpanded ? 'h-auto min-h-[700px]' : 'h-[700px]'}`}>
                                    <article className="flex flex-col h-full min-h-0">
                                        <CardContent className="p-0 flex flex-col h-full min-h-0">
                                            {/* Cover Image */}
                                            {hustle.imagePath ? (
                                                <div className="w-full overflow-hidden shrink-0 relative group flex items-center justify-center bg-surface">
                                                    <Image
                                                        src={hustle.imagePath}
                                                        alt={hustle.title}
                                                        width={1080}
                                                        height={1280}
                                                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                                        priority={index < 4}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 overflow-hidden shrink-0 relative bg-gradient-to-br from-primary/10 to-brand/10 border-b border-primary/20 flex flex-col items-center justify-center text-primary space-y-2">
                                                    <svg className="w-10 h-10 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-accent/80">{hustle.category.name}</span>
                                                </div>
                                            )}

                                            <div className="p-4 md:p-5 flex flex-col grow min-h-0">
                                                {/* Header */}
                                                <div className="mb-2">
                                                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                                        <Badge variant="default" className="bg-primary/20 text-accent border border-primary/30 text-[10px]">
                                                            {hustle.category.name}
                                                        </Badge>
                                                        <Badge variant="info" className="text-[10px] uppercase font-bold">
                                                            {formatBadgeText(hustle.hustleType)}
                                                        </Badge>
                                                        <Badge variant="success" className="text-[10px] uppercase font-bold">
                                                            {formatBadgeText(hustle.workMode)}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white leading-snug line-clamp-2">{hustle.title}</h3>
                                                    <p className="text-xs text-green-400 font-semibold mt-1">💰 {formatCompensation(hustle)}</p>
                                                </div>

                                                {/* Author info */}
                                                <div className="flex items-center space-x-3 text-xs text-text-muted bg-surface/50 p-2.5 rounded-xl border border-border/20 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-brand flex items-center justify-center text-white font-bold text-[10px]">
                                                        {hustle.author.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-white truncate">{hustle.author.name || 'Student'}</p>
                                                        <p className="text-text-dim truncate">{hustle.author.email}</p>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div
                                                    className={`relative flex-1 min-h-0 text-text-primary whitespace-pre-wrap leading-relaxed mb-1 text-sm ${!isExpanded ? 'overflow-hidden' : ''}`}
                                                    style={!isExpanded ? { maskImage: 'linear-gradient(to top, transparent, black 2rem)', WebkitMaskImage: 'linear-gradient(to top, transparent, black 2rem)' } : undefined}
                                                >
                                                    <LinkifyText>{hustle.description}</LinkifyText>
                                                </div>
                                                {hustle.description.split('\n').length > 4 || hustle.description.length > 150 ? (
                                                    <button
                                                        onClick={() => toggleExpand(hustle.id)}
                                                        className="text-accent text-xs font-medium hover:underline mb-2 mt-2 cursor-pointer self-start"
                                                    >
                                                        {isExpanded ? 'See less' : 'See more'}
                                                    </button>
                                                ) : <div className="mb-2" />}
                                            </div>

                                            {/* Action footer */}
                                            <div className="px-5 pb-5 pt-3 border-t border-border flex items-center justify-between mt-auto">
                                                <Button
                                                    variant="primary"
                                                    onClick={() => setContactHustle(hustle)}
                                                    className="flex-1 text-sm rounded-xl py-2.5 font-semibold"
                                                >
                                                    🤝 Contact / Apply
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </article>
                                </EventCard>
                            )
                        })}
                    </div>

                    {/* Pagination */}
                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="outline"
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                className="px-8 rounded-xl"
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Loading...</span>
                                    </div>
                                ) : (
                                    'Load More Hustles'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Contact Modal */}
            <Modal
                isOpen={!!contactHustle}
                onClose={() => setContactHustle(null)}
                title="Contact / Apply Details"
                size="sm"
            >
                {contactHustle && (
                    <div className="space-y-5 text-center">
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-white">{contactHustle.title}</h4>
                            <p className="text-sm text-text-muted">Listed by {contactHustle.author.name || 'Employer'}</p>
                        </div>

                        {contactHustle.contactNo ? (
                            <>
                                <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center space-y-2">
                                    <span className="text-xs text-text-dim uppercase tracking-wider font-semibold">Contact / Application link</span>
                                    <span className="text-md font-semibold text-white select-all break-all">{contactHustle.contactNo}</span>
                                    <span className="text-xs text-text-muted font-light">Mention that you found this on Univents!</span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <a
                                        href={getContactLink(contactHustle.contactNo)}
                                        target={contactHustle.contactNo.startsWith('http') ? "_blank" : undefined}
                                        rel={contactHustle.contactNo.startsWith('http') ? "noopener noreferrer" : undefined}
                                        className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-success hover:bg-success-hover text-white font-semibold transition-colors text-sm shadow-sm"
                                    >
                                        {getContactLabel(contactHustle.contactNo)}
                                    </a>
                                    
                                    {!contactHustle.contactNo.startsWith('http') && !contactHustle.contactNo.includes('@') && (
                                        <a
                                            href={formatWhatsappUrl(contactHustle.contactNo, contactHustle.title)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors text-sm shadow-sm"
                                        >
                                            💬 Chat on WhatsApp
                                        </a>
                                    )}

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => copyToClipboard(contactHustle.contactNo!)}
                                        className="w-full py-3"
                                    >
                                        📋 Copy Contact Info
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center space-y-2 text-text-muted">
                                <span className="text-3xl">📭</span>
                                <span className="text-sm font-semibold text-white">No Contact Details Provided</span>
                                <span className="text-xs font-light">The employer did not supply contact details. Please check the description for application instructions.</span>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}
