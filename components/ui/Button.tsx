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
    primary: 'bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-sm shadow-[#7c3aed]/20',
    secondary: 'bg-[#2D5A27] text-white hover:bg-[#244820] shadow-sm',
    accent: 'bg-[#a78bfa] text-[#0a0a0a] hover:bg-[#8b5cf6] shadow-sm',
    outline: 'border-2 border-[#7c3aed] text-[#a78bfa] hover:bg-[#7c3aed] hover:text-white',
    ghost: 'text-[#c4c4cc] hover:bg-[#1a1a2e] hover:text-white',
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
