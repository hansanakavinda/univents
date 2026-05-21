import React, { useState } from 'react'

export interface DropdownOption {
    label: string
    value: string
}

interface DropdownProps {
    value: string
    onChange: (value: string) => void
    options: DropdownOption[]
    placeholder?: string
    className?: string
}

export function Dropdown({ value, onChange, options, placeholder = 'Select an option', className = '' }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false)

    const selectedOption = options.find(o => o.value === value)

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-11 px-4 text-sm rounded-xl border border-border bg-surface text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer flex items-center justify-between"
            >
                <span className="truncate pr-4">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg className={`w-5 h-5 text-text-muted transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute left-0 right-0 mt-2 rounded-xl shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-border max-h-60 overflow-y-auto">
                        <div className="py-1">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange('')
                                    setIsOpen(false)
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${value === '' ? 'bg-primary/20 text-primary' : 'text-text-primary hover:bg-white/5 hover:text-white'}`}
                            >
                                {placeholder}
                            </button>
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${value === option.value ? 'bg-primary/20 text-primary' : 'text-text-primary hover:bg-white/5 hover:text-white'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
