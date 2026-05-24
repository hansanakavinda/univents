import getSession from '@/lib/getSession'
import { redirect, notFound } from 'next/navigation'
import { getAllUniversities } from '@/data-access/universities'
import { getAllCategories } from '@/data-access/categories'
import { getGigById } from '@/data-access/gigs'
import { GigForm } from '../../GigForm'

export default async function EditGigPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const { id } = await params
    const gig = await getGigById(id)

    if (!gig) {
        notFound()
    }

    // Security: Only allow author to edit
    if (gig.authorId !== session.user.id) {
        redirect('/gigs')
    }

    const universities = await getAllUniversities()
    const categories = await getAllCategories()

    const gigData = {
        id: gig.id,
        title: gig.title,
        description: gig.description,
        imagePath: gig.imagePath,
        priceType: gig.priceType,
        minPrice: gig.minPrice,
        maxPrice: gig.maxPrice,
        contactNo: gig.contactNo,
        categoryId: gig.categoryId,
        uniId: gig.uniId,
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Edit Your Gig</h1>
                <p className="text-text-muted">Modify your service offering. Updates will be re-submitted for moderation.</p>
            </header>

            <GigForm
                universities={JSON.parse(JSON.stringify(universities))}
                categories={JSON.parse(JSON.stringify(categories))}
                gigData={gigData}
            />
        </div>
    )
}
