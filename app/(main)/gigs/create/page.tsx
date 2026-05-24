import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { getAllUniversities } from '@/data-access/universities'
import { getAllCategories } from '@/data-access/categories'
import { GigForm } from '../GigForm'

export default async function CreateGigPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const universities = await getAllUniversities()
    const categories = await getAllCategories()

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Post a New Gig</h1>
                <p className="text-text-muted">Advertise your freelancing skills, projects, or services to the campus network</p>
            </header>

            <GigForm
                universities={JSON.parse(JSON.stringify(universities))}
                categories={JSON.parse(JSON.stringify(categories))}
            />
        </div>
    )
}
