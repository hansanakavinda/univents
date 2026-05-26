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

                    <div className="bg-surface border border-border rounded-xl p-4 sm:p-6">
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
        </>
    )
}
