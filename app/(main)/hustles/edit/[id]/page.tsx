import getSession from '@/lib/getSession'
import { redirect, notFound } from 'next/navigation'
import { getAllHustleCategories } from '@/data-access/hustle-categories'
import { getHustleById } from '@/data-access/hustles'
import { HustleForm } from '../../HustleForm'

export default async function EditHustlePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const { id } = await params
    const hustle = await getHustleById(id)

    if (!hustle) {
        notFound()
    }

    // Security: Only allow author to edit
    if (hustle.authorId !== session.user.id) {
        redirect('/hustles')
    }

    const categories = await getAllHustleCategories()

    const hustleData = {
        id: hustle.id,
        title: hustle.title,
        description: hustle.description,
        hustleType: hustle.hustleType,
        workMode: hustle.workMode,
        priceType: hustle.priceType,
        minPrice: hustle.minPrice,
        maxPrice: hustle.maxPrice,
        contactNo: hustle.contactNo,
        categoryId: hustle.categoryId,
        imagePath: hustle.imagePath,
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Edit Your Hustle</h1>
                <p className="text-text-muted">Modify your listed working opportunity. Updates will be re-submitted for moderation.</p>
            </header>

            <HustleForm
                categories={JSON.parse(JSON.stringify(categories))}
                hustleData={hustleData}
            />
        </div>
    )
}
