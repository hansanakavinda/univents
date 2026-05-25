import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { getAllUniversities } from '@/data-access/universities'
import { getAllCategories } from '@/data-access/categories'
import { getAllProductCategories } from '@/data-access/product-categories'
import { getAllHustleCategories } from '@/data-access/hustle-categories'
import { AdminDashboardTabs } from '@/components/admin/AdminDashboardTabs'

export default async function AdminDashboardPage() {
    const session = await getSession()

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        redirect('/dashboard')
    }

    const universities = await getAllUniversities()
    const categories = await getAllCategories()
    const productCategories = await getAllProductCategories()
    const hustleCategories = await getAllHustleCategories()

    return (
        <div className="p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-text-muted">Manage system configuration, universities, and categories</p>
            </header>

            <AdminDashboardTabs
                universities={JSON.parse(JSON.stringify(universities))}
                categories={JSON.parse(JSON.stringify(categories))}
                productCategories={JSON.parse(JSON.stringify(productCategories))}
                hustleCategories={JSON.parse(JSON.stringify(hustleCategories))}
            />
        </div>
    )
}
