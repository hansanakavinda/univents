import getSession from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getAllUniversities } from '@/data-access/universities'
import { UniversityActions, AddUniversityButton } from './UniversityActions'

export default async function AdminUniversitiesPage() {
    const session = await getSession()

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        redirect('/dashboard')
    }

    const universities = await getAllUniversities()

    return (
        <div className="flex min-h-screen">
            <Sidebar
                userRole={session.user.role}
                userName={session.user.name || 'User'}
                userEmail={session.user.email || ''}
            />

            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-full overflow-hidden">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">University Management</h1>
                        <p className="text-[#9ca3af]">Add, edit, or remove universities</p>
                    </div>
                    <AddUniversityButton />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Universities</CardDescription>
                            <CardTitle className="text-4xl text-[#a78bfa]">{universities.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Events</CardDescription>
                            <CardTitle className="text-4xl text-green-400">
                                {universities.reduce((sum, u) => sum + u._count.events, 0)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Users</CardDescription>
                            <CardTitle className="text-4xl text-blue-400">
                                {universities.reduce((sum, u) => sum + u._count.users, 0)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* University List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Universities</CardTitle>
                        <CardDescription>Manage registered universities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {universities.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-[#6b6b7b] mb-4">No universities added yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {universities.map((university) => (
                                    <div
                                        key={university.id}
                                        className="flex items-center justify-between p-4 rounded-xl bg-[#1a1a2e] hover:bg-[#25253d] transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-1">
                                                <h4 className="font-semibold text-white">{university.name}</h4>
                                                <Badge variant="default">{university.shortName}</Badge>
                                            </div>
                                            <div className="flex items-center space-x-4 text-xs text-[#6b6b7b]">
                                                <span>{university._count.events} event(s)</span>
                                                <span>•</span>
                                                <span>{university._count.users} user(s)</span>
                                                <span>•</span>
                                                <span>Added {new Date(university.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <UniversityActions university={university} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
