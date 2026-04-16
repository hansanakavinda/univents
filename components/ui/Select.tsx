import React from 'react'
import { type SelectHTMLAttributes } from 'react'

interface SelectOption {
    value: string
    label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string
    error?: string
    options: SelectOption[]
    placeholder?: string
}

export function Select({ label, error, options, placeholder, className = '', value, ...props }: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                    {label}
                </label>
            )}
            <select
                className={`
          w-full px-4 py-2.5 rounded-xl border
          ${error ? 'border-red-500' : 'border-border'}
          bg-surface text-white
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-card-disabled disabled:cursor-not-allowed disabled:text-text-dim
          transition-all duration-200
          ${!value ? 'text-text-dim' : ''}
          ${className}
        `}
                value={value}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-xs text-red-400">{error}</p>
            )}
        </div>
    )
}
