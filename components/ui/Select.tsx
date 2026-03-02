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
                <label className="block text-sm font-medium text-[#4B3621] mb-1.5">
                    {label}
                </label>
            )}
            <select
                className={`
          w-full px-4 py-2.5 rounded-xl border
          ${error ? 'border-red-500' : 'border-[#E5E5E4]'}
          bg-white text-[#4B3621]
          focus:outline-none focus:ring-2 focus:ring-[#CC5500] focus:border-transparent
          disabled:bg-[#F5F5F4] disabled:cursor-not-allowed
          transition-all duration-200
          ${!value ? 'text-gray-400' : ''}
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
                <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
        </div>
    )
}
