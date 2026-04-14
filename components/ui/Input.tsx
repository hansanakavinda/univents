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
          <label className="block text-sm font-medium text-[#c4c4cc] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border
            ${error ? 'border-red-500' : 'border-[#2d2d44]'}
            bg-[#1a1a2e] text-white
            placeholder:text-[#6b6b7b]
            focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent
            disabled:bg-[#111118] disabled:cursor-not-allowed disabled:text-[#6b6b7b]
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
        <label className="block text-sm font-medium text-[#c4c4cc] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-2.5 rounded-xl border
          ${error ? 'border-red-500' : 'border-[#2d2d44]'}
          bg-[#1a1a2e] text-white
          placeholder:text-[#6b6b7b]
          focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent
          disabled:bg-[#111118] disabled:cursor-not-allowed disabled:text-[#6b6b7b]
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
