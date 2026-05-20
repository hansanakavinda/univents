'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { Calendar, Briefcase, Zap, ShoppingBag, Bell, BellRing } from 'lucide-react'

interface TopNavProps {
  userName?: string
  userImage?: string | null
  userRole?: string
}

export function TopNav({ userName, userImage, userRole }: TopNavProps) {
  const pathname = usePathname()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { status: pushStatus, subscribe, unsubscribe } = usePushNotifications()

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Gigs', path: '/gigs', icon: Briefcase },
    { name: 'Hustles', path: '/hustles', icon: Zap },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-border">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-30">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-white tracking-wider">
              UNIVENTS
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                    ? 'text-white bg-surface'
                    : 'text-text-muted hover:text-white hover:bg-surface/50'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Notifications & User Profile */}
          <div className="flex items-center space-x-4">
            {/* Create Event Button Container */}
            <div className="w-10 md:w-[142px] flex justify-end">
              {pathname === '/events' && (
                <Link
                  href="/events/create"
                  className="inline-flex items-center p-2 md:px-4 md:py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap shadow-sm"
                >
                  <svg className="w-5 h-5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden md:inline">Create Event</span>
                </Link>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative flex items-center">
              <button
                onClick={() => {
                  if (pushStatus === 'subscribed') {
                    unsubscribe()
                  } else if (pushStatus === 'idle' || pushStatus === 'denied') {
                    subscribe()
                  }
                }}
                disabled={pushStatus === 'loading' || pushStatus === 'unsupported'}
                className={`p-2 transition-colors rounded-full focus:outline-none ${
                  pushStatus === 'subscribed' ? 'text-brand hover:text-brand/80' : 'text-text-muted hover:text-white hover:bg-surface'
                } ${pushStatus === 'loading' ? 'opacity-50 cursor-wait' : ''} ${
                  pushStatus === 'unsupported' ? 'hidden' : ''
                }`}
                title={pushStatus === 'subscribed' ? 'Disable notifications' : 'Enable notifications'}
              >
                {pushStatus === 'subscribed' ? (
                  <BellRing className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <Bell className="w-5 h-5 md:w-6 md:h-6" />
                )}
                {pushStatus === 'subscribed' && (
                  <span className="absolute top-1 right-2 w-2 h-2 md:top-2 md:right-2 md:w-2.5 md:h-2.5 bg-brand rounded-full border-2 border-black"></span>
                )}
              </button>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center focus:outline-none"
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName || 'User'}
                    className="w-9 h-9 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-brand flex items-center justify-center text-white font-semibold border border-border">
                    {userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown Panel */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-border">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-border mb-1">
                        <p className="text-sm font-medium text-white truncate">{userName || 'User'}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-text-primary hover:bg-white/5 hover:text-white transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-text-primary hover:bg-white/5 hover:text-white transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-text-primary hover:bg-white/5 hover:text-white transition-colors"
                      >
                        Settings
                      </Link>

                      {/* Admin Links */}
                      {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
                        <>
                          <div className="border-t border-border mt-1 mb-1"></div>
                          <div className="px-4 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider">
                            Admin
                          </div>
                          <Link
                            href="/admin/events"
                            onClick={() => setIsProfileOpen(false)}
                            className="block px-4 py-2 text-sm text-text-primary hover:bg-white/5 hover:text-white transition-colors"
                          >
                            Moderation
                          </Link>
                          {userRole === 'SUPER_ADMIN' && (
                            <>
                              <Link
                                href="/admin/universities"
                                onClick={() => setIsProfileOpen(false)}
                                className="block px-4 py-2 text-sm text-text-primary hover:bg-white/5 hover:text-white transition-colors"
                              >
                                Universities
                              </Link>
                              <Link
                                href="/admin"
                                onClick={() => setIsProfileOpen(false)}
                                className="block px-4 py-2 text-sm text-text-primary hover:bg-white/5 hover:text-white transition-colors"
                              >
                                User Management
                              </Link>
                            </>
                          )}
                        </>
                      )}

                      <div className="border-t border-border mt-1">
                        <button
                          onClick={() => signOut({ redirectTo: '/login' })}
                          className="block w-full text-left px-4 py-2 text-sm text-accent hover:bg-white/5 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-border pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.path)
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex flex-col items-center justify-center w-16 h-12 rounded-lg transition-colors ${
                  active ? 'text-white' : 'text-text-muted hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${active ? 'text-brand' : ''}`} />
                <span className="text-[10px] font-medium">{link.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
