import React from 'react'
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-radius-[12px]'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20',
    secondary: 'bg-success text-white hover:bg-success-hover shadow-sm',
    accent: 'bg-accent text-background hover:bg-accent-hover shadow-sm',
    outline: 'border-2 border-primary text-accent hover:bg-primary hover:text-white',
    ghost: 'text-text-primary hover:bg-surface hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-xl',
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
