import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { getAllHustleCategories } from '@/data-access/hustle-categories'
import { HustleForm } from '../HustleForm'

export default async function CreateHustlePage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const categories = await getAllHustleCategories()

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Post a New Hustle</h1>
                <p className="text-text-muted">Advertise internships, freelancing roles, or part-time work to help students earn money</p>
            </header>

            <HustleForm
                categories={JSON.parse(JSON.stringify(categories))}
            />
        </div>
    )
}
