import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function EventCard({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-card/50 rounded-xl shadow-sm border border-border
        ${hover ? 'hover:shadow-md hover:shadow-primary/5 transition-shadow duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`p-2 md:p-6
        bg-card rounded-xl shadow-sm border border-border
        ${hover ? 'hover:shadow-md hover:shadow-primary/5 transition-shadow duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-xl font-semibold text-white ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-text-muted mt-1 ${className}`}>{children}</p>
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
