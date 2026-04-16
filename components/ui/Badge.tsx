import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-surface text-text-primary border-border',
    success: 'bg-green-900/40 text-green-400 border-green-800/50',
    warning: 'bg-yellow-900/40 text-yellow-400 border-yellow-800/50',
    danger: 'bg-red-900/40 text-red-400 border-red-800/50',
    info: 'bg-blue-900/40 text-blue-400 border-blue-800/50',
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
