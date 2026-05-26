'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastMessage {
  id: string
  variant: ToastVariant
  message: string
  /** milliseconds remaining when the toast was last resumed */
  remaining: number
  /** whether the countdown is paused (mouse hover) */
  paused: boolean
  /** whether the exit animation is playing */
  exiting: boolean
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
  }
}

const TOAST_DURATION = 3_000 // 3 seconds auto-dismiss

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return ctx.toast
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((variant: ToastVariant, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((prev) => [
      ...prev,
      { id, variant, message, remaining: TOAST_DURATION, paused: false, exiting: false },
    ])
  }, [])

  const removeToast = useCallback((id: string) => {
    // trigger exit animation first
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    )
    // remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  const pauseToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, paused: true } : t)),
    )
  }, [])

  const resumeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, paused: false } : t)),
    )
  }, [])

  const toast = {
    success: (msg: string) => addToast('success', msg),
    error: (msg: string) => addToast('error', msg),
    warning: (msg: string) => addToast('warning', msg),
    info: (msg: string) => addToast('info', msg),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container — fixed top-right on desktop, top-center full-width on mobile */}
      <div
        aria-live="polite"
        className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-6 z-[9999] flex flex-col gap-3 pointer-events-none"
        style={{ maxWidth: 420 }}
      >
        {toasts.map((t) => (
          <ToastCard
            key={t.id}
            toast={t}
            onClose={() => removeToast(t.id)}
            onPause={() => pauseToast(t.id)}
            onResume={() => resumeToast(t.id)}
            onExpire={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/*  Variant config                                                     */
/* ------------------------------------------------------------------ */

const VARIANT_STYLES: Record<
  ToastVariant,
  { border: string; icon: ReactNode; progressColor: string; glowColor: string }
> = {
  success: {
    border: 'border-emerald-500/20 shadow-[0_4px_20px_rgba(16,185,129,0.15)]',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    progressColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
  },
  error: {
    border: 'border-red-500/20 shadow-[0_4px_20px_rgba(239,68,68,0.15)]',
    icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />,
    progressColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
  warning: {
    border: 'border-amber-500/20 shadow-[0_4px_20px_rgba(245,158,11,0.15)]',
    icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    progressColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
  },
  info: {
    border: 'border-primary/30 shadow-[0_4px_20px_rgba(124,58,237,0.15)]',
    icon: <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />,
    progressColor: '#7c3aed',
    glowColor: 'rgba(124, 58, 237, 0.4)',
  },
}

/* ------------------------------------------------------------------ */
/*  Individual toast card                                              */
/* ------------------------------------------------------------------ */

interface ToastCardProps {
  toast: ToastMessage
  onClose: () => void
  onPause: () => void
  onResume: () => void
  onExpire: () => void
}

function ToastCard({ toast, onClose, onPause, onResume, onExpire }: ToastCardProps) {
  const style = VARIANT_STYLES[toast.variant]
  const remainingRef = useRef(toast.remaining)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ---------- countdown logic ---------- */
  useEffect(() => {
    if (toast.paused) {
      // stop counting when paused
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    // tick every 100ms
    timerRef.current = setInterval(() => {
      remainingRef.current -= 100
      if (remainingRef.current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        onExpire()
      }
    }, 100)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [toast.paused, onExpire])

  return (
    <div
      className={`
        pointer-events-auto flex w-full sm:w-auto items-start gap-3.5 rounded-xl border
        bg-black/80 backdrop-blur-xl ${style.border}
        pl-4 pr-3.5 py-3.5 overflow-hidden
        ${toast.exiting ? 'toast-slide-out' : 'toast-slide-in'}
        transition-all duration-300 hover:bg-black/90
      `}
      style={{ minWidth: 'min(320px, 100%)' }}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      role="alert"
    >
      {/* Icon */}
      {style.icon}

      {/* Message */}
      <p className="flex-1 pt-0.5 text-sm text-foreground leading-snug font-medium">{toast.message}</p>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-lg p-1 text-text-muted hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[3px]"
        style={{
          background: style.progressColor,
          boxShadow: `0 0 8px ${style.glowColor}`,
          animation: `toast-progress ${TOAST_DURATION}ms linear forwards`,
          animationPlayState: toast.paused ? 'paused' : 'running',
          width: '100%',
        }}
      />
    </div>
  )
}
