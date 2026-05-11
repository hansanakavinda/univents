import SidebarLayout from '@/components/SidebarLayout'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarLayout>
            {children}
        </SidebarLayout>
    )
}
