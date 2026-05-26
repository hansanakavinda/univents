import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { getAllUniversities } from '@/data-access/universities'
import { ProfileForm } from './ProfileForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Your Profile | Univents',
    description: 'Manage your personal information and profile settings on Univents.',
}

export default async function ProfilePage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, image: true, uniId: true, email: true }
    })

    if (!user) {
        redirect('/login')
    }

    const universities = await getAllUniversities()

    return (
        <>
            <div className="p-4 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Your Profile</h1>
                        <p className="text-sm md:text-base text-text-muted">Manage your personal information</p>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                        {/* Premium Cover Banner */}
                        <div className="h-24 sm:h-32 bg-gradient-to-r from-purple-900/40 via-primary/30 to-accent/10 relative overflow-hidden border-b border-white/5">
                            {/* Ambient glows inside banner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl translate-x-12 -translate-y-12" />
                            <div className="absolute bottom-0 left-10 w-24 h-24 bg-accent/20 rounded-full blur-2xl -translate-x-6 translate-y-6" />
                            {/* Decorative line patterns */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                        </div>

                        {/* Inner padding for form container */}
                        <div className="p-4 sm:p-6 pt-0">
                            <ProfileForm
                                initialData={{
                                    name: user.name || '',
                                    uniId: user.uniId || '',
                                    image: user.image || '',
                                    email: user.email
                                }}
                                universities={universities}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
