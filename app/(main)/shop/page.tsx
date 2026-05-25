import { getAllUniversities } from '@/data-access/universities'
import { getAllProductCategories } from '@/data-access/product-categories'
import { getApprovedProductsPaginated } from '@/data-access/products'
import { ProductsList } from './ProductsList'
import getSession from '@/lib/getSession'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Student Marketplace Shop | Univents',
    description:
        'Buy and sell items, academic resources, textbooks, and goods across Sri Lankan universities.',
    openGraph: {
        title: 'Student Marketplace Shop | Univents',
        description:
            'Buy and sell items, academic resources, textbooks, and goods across Sri Lankan universities.',
    },
    alternates: {
        canonical: 'https://univents.com.lk/shop',
    },
}

export default async function ShopPage() {
    const session = await getSession()
    const isAuthenticated = !!session

    // Fetch initial product data on the server
    const initialProducts = await getApprovedProductsPaginated({ take: 8, skip: 0 })
    const categories = await getAllProductCategories()
    const universities = await getAllUniversities()

    return (
        <div className="px-4 md:p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-6 border-b border-border/40">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                        Student <span className="text-primary">Shop</span> & Goods
                    </h1>
                    <p className="text-text-muted text-sm max-w-xl">
                        Buy, sell, or trade textbooks, stationery, electronic accessories, and college essentials directly with peers.
                    </p>
                </div>
                {isAuthenticated && (
                    <div className="flex justify-center shrink-0">
                        <Link
                            href="/shop/create"
                            className="group inline-flex items-center px-5 py-3 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-white/10 hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Post an Item
                        </Link>
                    </div>
                )}
            </header>

            <section aria-label="Student shop products" className="w-full">
                <ProductsList
                    initialProducts={JSON.parse(JSON.stringify(initialProducts))}
                    categories={JSON.parse(JSON.stringify(categories))}
                    universities={JSON.parse(JSON.stringify(universities))}
                />
            </section>
        </div>
    )
}
