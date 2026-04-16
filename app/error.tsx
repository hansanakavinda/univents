'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className="text-center max-w-md w-full rounded-2xl border border-border bg-card p-8 shadow-sm"
        aria-live="polite"
      >
        <h2 className="text-2xl font-bold text-white mb-3">Something went wrong!</h2>
        <p className="text-text-muted mb-6">Our system encountered a small hiccup.</p>
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}