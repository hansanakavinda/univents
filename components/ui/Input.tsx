import React from 'react'
import { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className = '', ...props }, ref) {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border
            ${error ? 'border-red-500' : 'border-border'}
            bg-surface text-white
            placeholder:text-text-dim
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:bg-card-disabled disabled:cursor-not-allowed disabled:text-text-dim
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-2.5 rounded-xl border
          ${error ? 'border-red-500' : 'border-border'}
          bg-surface text-white
          placeholder:text-text-dim
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-card-disabled disabled:cursor-not-allowed disabled:text-text-dim
          transition-all duration-200
          resize-vertical
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}
