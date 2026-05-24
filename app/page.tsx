import Link from 'next/link'
import { Calendar, Zap, Briefcase, ShoppingBag, ArrowRight } from 'lucide-react'
import getSession from '@/lib/getSession'
import { TopNav } from '@/components/TopNav'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
    const session = await getSession()

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <TopNav
                userName={session?.user?.name || 'User'}
                userImage={session?.user?.image || null}
                userRole={session?.user?.role || 'USER'}
                isLoggedIn={!!session}
            />

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden pt-16 md:pt-20">
                {/* Background Decorators */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

                {/* Hero Section */}
                <section className="w-full max-w-5xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border mb-8 animate-in slide-in-from-bottom-4 duration-500">
                        <span className="flex h-2 w-2 rounded-full bg-brand"></span>
                        <span className="text-xs font-semibold text-text-primary tracking-wide uppercase">The #1 Campus Network in Sri Lanka</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-in slide-in-from-bottom-6 duration-700">
                        The Pulse of Your <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-brand">
                            Campus Life
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-8 duration-1000">
                        Discover epic university events, find part-time gigs, explore hustle opportunities, and trade campus essentials—all in one vibrant community.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-bottom-10 duration-1000 w-full sm:w-auto">
                        <Link href="/events" className="w-full sm:w-auto group inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl bg-primary hover:bg-primary-hover text-white transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:-translate-y-1">
                            Explore Events
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        {!session && (
                            <Link href="/login" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-surface border border-border hover:bg-surface-hover text-white transition-all hover:-translate-y-1">
                                Sign In
                            </Link>
                        )}
                    </div>
                </section>

                {/* Features Grid */}
                <section className="w-full max-w-7xl mx-auto px-4 py-20 z-10 relative">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need, In One Place</h2>
                        <p className="text-text-muted max-w-2xl mx-auto">Explore the four core pillars designed specifically for the modern Sri Lankan university student.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Event Card */}
                        <Link href="/events" className="group p-8 rounded-[2rem] bg-surface/50 border border-border hover:border-primary/50 hover:bg-surface transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <Calendar className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Events</h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-6 flex-grow">
                                Never miss out. Discover the biggest campus parties, insightful workshops, and massive hackathons happening near you.
                            </p>
                            <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:text-accent transition-colors mt-auto">
                                Browse Events <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        {/* Gigs Card */}
                        <Link href="/gigs" className="group p-8 rounded-[2rem] bg-surface/50 border border-border hover:border-brand/50 hover:bg-surface transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-6 group-hover:bg-brand/20 transition-colors">
                                <Briefcase className="w-7 h-7 text-brand" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Gigs</h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-6 flex-grow">
                                Want to earn some extra cash? Sell your skills, services, or anything you're good at. Create a gig and see who bites.
                            </p>
                            <span className="inline-flex items-center text-sm font-semibold text-brand group-hover:brightness-125 transition-all mt-auto">
                                Find Gigs <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        {/* Hustles Card */}
                        <Link href="/hustles" className="group p-8 rounded-[2rem] bg-surface/50 border border-border hover:border-accent/50 hover:bg-surface transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                                <Zap className="w-7 h-7 text-accent" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Hustles</h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-6 flex-grow">
                                Ready for the long game? Discover ongoing part-time opportunities, internships, and freelance projects to build your career.
                            </p>
                            <span className="inline-flex items-center text-sm font-semibold text-accent group-hover:text-white transition-colors mt-auto">
                                Explore Hustles <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        {/* Shop Card */}
                        <Link href="/shop" className="group p-8 rounded-[2rem] bg-surface/50 border border-border hover:border-success/50 hover:bg-surface transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
                                <ShoppingBag className="w-7 h-7 text-success" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Shop</h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-6 flex-grow">
                                The ultimate student marketplace. Buy, sell, and trade textbooks, electronics, and other campus essentials locally.
                            </p>
                            <span className="inline-flex items-center text-sm font-semibold text-success group-hover:brightness-125 transition-all mt-auto">
                                Visit Shop <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </div>
                </section>

                {/* Footer CTA */}
                {!session && (
                    <section className="w-full max-w-4xl mx-auto px-4 py-24 z-10 text-center">
                        <div className="p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-primary/10 via-surface to-accent/10 border border-border/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to join the movement?</h2>
                                <p className="text-lg text-text-muted mb-10 max-w-xl mx-auto">Create an account today and become part of the fastest-growing student network in the country.</p>
                                <Link href="/auth/signup" className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-xl bg-white text-black hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:scale-105 active:scale-95">
                                    Create Free Account
                                </Link>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* Simple Footer */}
            <footer className="w-full py-8 text-center text-sm text-text-dim border-t border-border/40 z-10 bg-surface/30">
                <p>&copy; {new Date().getFullYear()} Univents. All rights reserved.</p>
            </footer>
        </div>
    )
}
