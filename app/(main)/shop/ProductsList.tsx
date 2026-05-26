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
import { Product } from '@/types/product'

interface University {
    id: string
    name: string
    shortName: string
}

interface Category {
    id: string
    name: string
}

interface ProductsListProps {
    initialProducts: Product[]
    categories: Category[]
    universities: University[]
}

export function ProductsList({
    initialProducts,
    categories,
    universities,
}: ProductsListProps) {
    const toast = useToast()
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [isLoading, setIsLoading] = useState(false)
    const [isFiltering, setIsFiltering] = useState(false)
    const [hasMore, setHasMore] = useState(initialProducts.length >= 8)

    // Filters
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const [selectedUniId, setSelectedUniId] = useState('')
    const [selectedPriceType, setSelectedPriceType] = useState('')

    // Selected Contact Product
    const [contactProduct, setContactProduct] = useState<Product | null>(null)

    // Expanded Descriptions
    const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set())

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    const toggleExpand = (productId: string) => {
        setExpandedProducts((prev) => {
            const next = new Set(prev)
            if (next.has(productId)) {
                next.delete(productId)
            } else {
                next.add(productId)
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
        if (selectedUniId) params.set('uniId', selectedUniId)
        if (selectedPriceType) params.set('priceType', selectedPriceType)
        return `/api/products/list?${params.toString()}`
    }, [debouncedSearch, selectedCategoryId, selectedUniId, selectedPriceType])

    // Fetch filtered products when filters change
    useEffect(() => {
        const fetchFiltered = async () => {
            setIsFiltering(true)
            try {
                const response = await fetch(buildFetchUrl(0))
                const data = await response.json()
                if (data.products) {
                    setProducts(data.products)
                    setHasMore(data.products.length >= 8)
                }
            } catch (err) {
                console.error('Failed to fetch filtered products:', err)
            } finally {
                setIsFiltering(false)
            }
        }
        fetchFiltered()
    }, [debouncedSearch, selectedCategoryId, selectedUniId, selectedPriceType, buildFetchUrl])

    const handleLoadMore = async () => {
        if (isLoading || !hasMore) return
        setIsLoading(true)
        try {
            const response = await fetch(buildFetchUrl(products.length))
            const data = await response.json()
            if (data.products) {
                setProducts((prev) => [...prev, ...data.products])
                setHasMore(data.products.length >= 8)
            }
        } catch (err) {
            console.error('Failed to load more products:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const formatPrice = (product: Product) => {
        if (product.priceType === 'NEGOTIABLE') return 'Negotiable'
        return `LKR ${product.price?.toLocaleString()}`
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Contact copied to clipboard!')
    }

    const formatWhatsappUrl = (contact: string, title: string) => {
        if (contact.startsWith('http')) return contact
        const cleanNo = contact.replace(/\D/g, '')
        const formattedNo = cleanNo.startsWith('0') ? '94' + cleanNo.substring(1) : cleanNo
        return `https://wa.me/${formattedNo}?text=Hi! I saw your item "${encodeURIComponent(title)}" on Univents and I'm interested.`
    }

    const universityOptions = universities.map((uni) => ({
        value: uni.id,
        label: uni.name,
    }))

    const priceTypeOptions = [
        { value: 'FIXED', label: 'Fixed Price' },
        { value: 'NEGOTIABLE', label: 'Negotiable' },
    ]

    return (
        <div className="space-y-6">
            {/* Filter Controls */}
            <div className="mb-8 mt-2 flex flex-col items-center gap-4 sticky top-[88px] z-30 px-4 md:px-0">
                <div className="relative z-40 flex flex-col md:flex-row items-center gap-1.5 p-1.5 rounded-[1.25rem] md:rounded-full bg-surface/70 backdrop-blur-xl border border-white/10 shadow-xl w-full max-w-4xl">
                    {/* Search */}
                    <div className="flex-1 w-full relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
                        <input
                            type="text"
                            placeholder="Search items by title or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 text-sm bg-transparent border-0 ring-0 focus:outline-none focus:ring-0 text-white placeholder:text-text-dim rounded-full hover:bg-white/5 transition-colors"
                        />
                    </div>

                    <div className="hidden md:block w-px h-6 bg-white/10 mx-1"></div>
                    <div className="block md:hidden w-full h-px bg-white/10 my-1"></div>

                    {/* University Filter */}
                    <div className="w-full md:w-auto md:min-w-[200px] relative z-30">
                        <Dropdown
                            options={universityOptions}
                            value={selectedUniId}
                            onChange={setSelectedUniId}
                            placeholder="All Universities"
                            className="w-full [&>button]:!bg-transparent [&>button]:!border-0 [&>button]:!shadow-none [&>button]:!ring-0 hover:[&>button]:!bg-white/5 [&>button]:!rounded-full [&>button]:transition-colors"
                        />
                    </div>

                    <div className="hidden md:block w-px h-6 bg-white/10 mx-1"></div>
                    <div className="block md:hidden w-full h-px bg-white/10 my-1"></div>

                    {/* Price Type Filter */}
                    <div className="w-full md:w-auto md:min-w-[180px] relative z-20">
                        <Dropdown
                            options={priceTypeOptions}
                            value={selectedPriceType}
                            onChange={setSelectedPriceType}
                            placeholder="All Pricing Types"
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

            {/* Products List Section */}
            {isFiltering ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-text-muted">Filtering products...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-card rounded-2xl border border-border text-center p-6">
                    <svg className="w-16 h-16 text-text-dim mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">No Items Found</h3>
                    <p className="text-text-muted max-w-md mb-6">Be the first to post an item in this category or search term to sell your goods!</p>
                    <Link
                        href="/shop/create"
                        className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
                    >
                        Post an Item
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => {
                            const isExpanded = expandedProducts.has(product.id)

                            return (
                                <EventCard key={product.id} hover className={`w-full flex flex-col relative overflow-hidden transition-all duration-300 ${isExpanded ? 'h-auto min-h-[600px]' : 'h-[600px]'}`}>
                                    <article className="flex flex-col h-full min-h-0">
                                        <CardContent className="p-0 flex flex-col h-full min-h-0">
                                            {/* Cover Image */}
                                            {product.imagePath ? (
                                                <div className="w-full h-48 overflow-hidden shrink-0 relative group flex items-center justify-center bg-surface">
                                                    <Image
                                                        src={product.imagePath}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        priority={index < 4}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 overflow-hidden shrink-0 relative bg-gradient-to-br from-primary/10 to-brand/10 border-b border-primary/20 flex flex-col items-center justify-center text-primary space-y-2">
                                                    <svg className="w-10 h-10 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-accent/80">{product.category.name}</span>
                                                </div>
                                            )}

                                            <div className="p-4 md:p-5 flex flex-col grow min-h-0">
                                                {/* Header */}
                                                <div className="mb-2">
                                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                                        <Badge variant="default" className="bg-primary/20 text-accent border border-primary/30 text-[10px]">
                                                            {product.category.name}
                                                        </Badge>
                                                        <span className="text-sm font-semibold text-green-400">{formatPrice(product)}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white leading-snug line-clamp-2">{product.title}</h3>
                                                </div>

                                                {/* Author & Uni info */}
                                                <div className="flex items-center space-x-3 text-xs text-text-muted bg-surface/50 p-2.5 rounded-xl border border-border/20 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-brand flex items-center justify-center text-white font-bold text-[10px]">
                                                        {product.author.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-white truncate">{product.author.name || 'Student'}</p>
                                                        <p className="text-text-dim truncate">{product.university.name} ({product.university.shortName})</p>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div
                                                    className={`relative flex-1 min-h-0 text-text-primary whitespace-pre-wrap leading-relaxed mb-1 text-sm ${!isExpanded ? 'overflow-hidden' : ''}`}
                                                    style={!isExpanded ? { maskImage: 'linear-gradient(to top, transparent, black 2rem)', WebkitMaskImage: 'linear-gradient(to top, transparent, black 2rem)' } : undefined}
                                                >
                                                    <LinkifyText>{product.description}</LinkifyText>
                                                </div>
                                                {product.description.split('\n').length > 4 || product.description.length > 150 ? (
                                                    <button
                                                        onClick={() => toggleExpand(product.id)}
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
                                                    onClick={() => setContactProduct(product)}
                                                    className="flex-1 text-sm rounded-xl py-2.5 font-semibold"
                                                >
                                                    🤝 Contact Seller
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
                                    'Load More Items'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Contact Modal */}
            <Modal
                isOpen={!!contactProduct}
                onClose={() => setContactProduct(null)}
                title="Contact Seller"
                size="sm"
            >
                {contactProduct && (
                    <div className="space-y-5 text-center">
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-white">{contactProduct.title}</h4>
                            <p className="text-sm text-text-muted">Offered by {contactProduct.author.name || 'Seller'}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center space-y-2">
                            <span className="text-xs text-text-dim uppercase tracking-wider font-semibold">Contact Details</span>
                            <span className="text-xl font-bold text-white select-all">{contactProduct.contactNo}</span>
                            <span className="text-xs text-text-muted">Make sure to tell them you found it on Univents!</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {!contactProduct.contactNo.startsWith('http') && (
                                <a
                                    href={`tel:${contactProduct.contactNo}`}
                                    className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-success hover:bg-success-hover text-white font-semibold transition-colors text-sm shadow-sm"
                                >
                                    📞 Call Seller
                                </a>
                            )}
                            <a
                                href={formatWhatsappUrl(contactProduct.contactNo, contactProduct.title)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors text-sm shadow-sm"
                            >
                                💬 Chat on WhatsApp
                            </a>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => copyToClipboard(contactProduct.contactNo)}
                                className="w-full py-3"
                            >
                                📋 Copy Contact Info
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
