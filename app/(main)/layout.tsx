import { TopNav } from '@/components/TopNav'
import getSession from '@/lib/getSession'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession()

    return (
        <div className="flex flex-col min-h-screen">
            <TopNav
                userName={session?.user?.name || 'User'}
                userImage={session?.user?.image || null}
                userRole={session?.user?.role || 'USER'}
                isLoggedIn={!!session}
            />
            <main className="flex-1 w-full max-w-full overflow-hidden pt-16 pb-16 md:pb-0 md:pt-20">
                {children}
            </main>
        </div>
    )
}
