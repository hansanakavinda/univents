import getSession from '@/lib/getSession'
import { redirect, notFound } from 'next/navigation'
import { getAllUniversities } from '@/data-access/universities'
import { getAllProductCategories } from '@/data-access/product-categories'
import { getProductById } from '@/data-access/products'
import { ProductForm } from '../../ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const { id } = await params
    const product = await getProductById(id)

    if (!product) {
        notFound()
    }

    // Security: Only allow author to edit
    if (product.authorId !== session.user.id) {
        redirect('/shop')
    }

    const universities = await getAllUniversities()
    const categories = await getAllProductCategories()

    const productData = {
        id: product.id,
        title: product.title,
        description: product.description,
        imagePath: product.imagePath,
        priceType: product.priceType,
        price: product.price,
        contactNo: product.contactNo,
        categoryId: product.categoryId,
        uniId: product.uniId,
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Edit Your Item</h1>
                <p className="text-text-muted">Modify your listed item. Updates will be re-submitted for moderation.</p>
            </header>

            <ProductForm
                universities={JSON.parse(JSON.stringify(universities))}
                categories={JSON.parse(JSON.stringify(categories))}
                productData={productData}
            />
        </div>
    )
}
