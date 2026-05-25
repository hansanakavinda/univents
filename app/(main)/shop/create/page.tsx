import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { getAllUniversities } from '@/data-access/universities'
import { getAllProductCategories } from '@/data-access/product-categories'
import { ProductForm } from '../ProductForm'

export default async function CreateProductPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const universities = await getAllUniversities()
    const categories = await getAllProductCategories()

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Post a New Item</h1>
                <p className="text-text-muted">Advertise textbooks, materials, devices, or college gear to sell on campus</p>
            </header>

            <ProductForm
                universities={JSON.parse(JSON.stringify(universities))}
                categories={JSON.parse(JSON.stringify(categories))}
            />
        </div>
    )
}
