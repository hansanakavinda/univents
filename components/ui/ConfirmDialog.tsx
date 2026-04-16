'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary'
    isLoading?: boolean
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, isLoading, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isLoading) onClose()
            }}
        >
            <div
                ref={dialogRef}
                className="w-full max-w-sm bg-card rounded-2xl shadow-2xl border border-border
                    transform transition-all animate-in fade-in zoom-in duration-200"
            >
                {/* Icon */}
                <div className="flex justify-center pt-6">
                    <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center
                        ${variant === 'danger'
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-primary/15 text-primary'}
                    `}>
                        {variant === 'danger' ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        ) : (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pt-4 pb-2 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 pt-4">
                    <Button
                        variant="ghost"
                        className="flex-1 border border-border"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        className="flex-1"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Processing…
                            </span>
                        ) : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    )
}
