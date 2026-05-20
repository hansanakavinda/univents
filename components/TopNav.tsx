'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { usePushNotifications } from '@/hooks/usePushNotifications'

interface TopNavProps {
  userName?: string
  userImage?: string | null
  userRole?: string
}

export function TopNav({ userName, userImage, userRole }: TopNavProps) {
  const pathname = usePathname()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const { status: pushStatus, subscribe, unsubscribe } = usePushNotifications()

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { name: 'Events', path: '/events' },
    { name: 'Shop', path: '/shop' },
    { name: 'Gigs', path: '/gigs' },
    { name: 'Hustles', path: '/hustles' },
  ]

  return (
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
            <div className="w-[142px] flex justify-end">
              {pathname === '/events' && (
                <Link
                  href="/events/create"
                  className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Event
                </Link>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative flex items-center">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-text-muted hover:text-white transition-colors rounded-full hover:bg-surface focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {pushStatus === 'subscribed' && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand rounded-full border-2 border-black"></span>
                )}
              </button>

              {isNotifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotifOpen(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-xl shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-border">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-white mb-4">Notifications</h3>

                      {pushStatus !== 'unsupported' ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-primary">Push Notifications</span>
                          <button
                            onClick={() => {
                              if (pushStatus === 'subscribed') {
                                unsubscribe()
                              } else if (pushStatus === 'idle' || pushStatus === 'denied') {
                                subscribe()
                              }
                            }}
                            disabled={pushStatus === 'loading'}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${pushStatus === 'subscribed' ? 'bg-primary' : 'bg-gray-600'
                              } ${pushStatus === 'loading' ? 'opacity-50 cursor-wait' : ''}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushStatus === 'subscribed' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-text-muted">Push notifications are not supported on this device.</p>
                      )}

                      {pushStatus === 'denied' && (
                        <p className="text-xs text-red-400 mt-2">Notifications are blocked in your browser settings.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
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

      {/* Mobile Navigation */}
      <div className="md:hidden overflow-x-auto border-t border-border bg-black/50">
        <div className="flex space-x-1 px-2 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium ${isActive(link.path)
                ? 'text-white bg-surface'
                : 'text-text-muted hover:text-white hover:bg-surface/50'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
