'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Role } from '@/types/auth'

interface SidebarProps {
  userRole?: Role
  userName?: string
  userEmail?: string
}

export function Sidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
    },
    {
      name: 'Events',
      path: '/events',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      roles: ['USER', 'ADMIN', 'SUPER_ADMIN'],
    },
    {
      name: 'Moderation',
      path: '/admin/events',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      roles: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      name: 'Universities',
      path: '/admin/universities',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      roles: ['SUPER_ADMIN'],
    },
    {
      name: 'User Management',
      path: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      roles: ['SUPER_ADMIN'],
    },
  ]

  const [isOpen, setIsOpen] = useState(false)

  const visibleMenuItems = menuItems.filter((item) =>
    !userRole || item.roles.includes(userRole)
  )

  return (
    <>
      {/* Mobile Toggle Button (Visible only on mobile when sidebar is closed) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-xl bg-[#1a1a2e] shadow-md text-[#a78bfa]"
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-full md:w-64 bg-black/10 border-r border-[#2d2d44] z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        {/* Logo and Close Button */}
        <div className="p-6 border-b border-[#2d2d44] flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div>
              <h1 className="text-lg font-bold text-white">Univents</h1>
            </div>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-[#9ca3af] hover:text-white"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl
                transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-[#7c3aed] text-white shadow-md shadow-[#7c3aed]/20'
                  : 'text-[#c4c4cc] hover:bg-[#1a1a2e] hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        {userName && (
          <div className="p-4 border-t border-[#2d2d44]">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#1a1a2e]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#CC5500] flex items-center justify-center text-white font-semibold flex-shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-[#9ca3af] truncate">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ redirectTo: '/login' })}
              className="w-full px-4 py-2 rounded-xl text-sm font-medium text-[#a78bfa] hover:bg-[#1a1a2e] transition-colors duration-200 mt-2"
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
