import { Sidebar } from '@/components/Sidebar'
import getSession from '@/lib/getSession'

export default async function SidebarLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession()
    
    return (
        <div className="flex min-h-screen">
            {session && (
                <Sidebar
                    userRole={session.user?.role || 'USER'}
                    userName={session.user?.name || 'User'}
                    userImage={session.user?.image || null}
                />
            )}
            <main className={`flex-1 w-full max-w-full overflow-hidden ${session ? 'md:ml-64 pt-20 md:pt-8' : ''}`}>
                {children}
            </main>
        </div>
    )
}
