'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { UserManagementActions } from '@/components/user/UserManagementActions'
import { UserUniversitySelect } from '@/components/user/UserUniversitySelect'

interface UserRecord {
  id: string
  name: string | null
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
  authProvider: 'MANUAL' | 'GOOGLE'
  isActive: boolean
  uniId?: string | null
  createdAt: Date | string
  _count: {
    events: number
  }
}

interface UserRoleTabsProps {
  users: UserRecord[]
  universities: { id: string; name: string }[]
  currentUserId: string
}

const tabConfig = [
  {
    key: 'SUPER_ADMIN',
    title: 'Super Admins',
    description: 'Highest-level access and permissions',
  },
  {
    key: 'ADMIN',
    title: 'Admins',
    description: 'Moderation and management access',
  },
  {
    key: 'USER',
    title: 'Users',
    description: 'Standard user accounts',
  },
] as const

type TabKey = (typeof tabConfig)[number]['key']

export function UserRoleTabs({ users, universities, currentUserId }: UserRoleTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('SUPER_ADMIN')

  const groupedUsers = useMemo(() => {
    return {
      SUPER_ADMIN: users.filter(user => user.role === 'SUPER_ADMIN'),
      ADMIN: users.filter(user => user.role === 'ADMIN'),
      USER: users.filter(user => user.role === 'USER'),
    }
  }, [users])

  const activeConfig = tabConfig.find(tab => tab.key === activeTab) ?? tabConfig[0]
  const tableUsers = groupedUsers[activeTab]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {tabConfig.map((tab) => {
          const isActive = tab.key === activeTab
          const count = groupedUsers[tab.key].length

          return (
            <Button
              key={tab.key}
              variant={isActive ? 'primary' : 'ghost'}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="mr-2">{tab.title}</span>
              <span className="inline-flex min-w-[28px] items-center justify-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                {count}
              </span>
            </Button>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{activeConfig.title}</CardTitle>
          <CardDescription>{activeConfig.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Provider</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Events</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">University</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-surface transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-brand flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name || 'No Name'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-muted">{user.email}</td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          user.role === 'SUPER_ADMIN'
                            ? 'danger'
                            : user.role === 'ADMIN'
                              ? 'info'
                              : 'default'
                        }
                      >
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={user.authProvider === 'GOOGLE' ? 'info' : 'default'}>
                        {user.authProvider}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-text-muted">{user._count.events}</td>
                    <td className="py-4 px-4 text-sm text-text-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <UserUniversitySelect
                        userId={user.id}
                        currentUniId={user.uniId || null}
                        universities={universities}
                        isCurrentUser={user.id === currentUserId}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <UserManagementActions
                        userId={user.id}
                        userEmail={user.email}
                        currentRole={user.role}
                        userUniId={user.uniId || null}
                        isActive={user.isActive}
                        isCurrentUser={user.id === currentUserId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
