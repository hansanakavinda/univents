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
        className="text-center max-w-md w-full rounded-2xl border border-[#2d2d44] bg-[#16161a] p-8 shadow-sm"
        aria-live="polite"
      >
        <h2 className="text-2xl font-bold text-white mb-3">Something went wrong!</h2>
        <p className="text-[#9ca3af] mb-6">Our system encountered a small hiccup.</p>
        <button
          onClick={() => reset()}
          className="bg-[#7c3aed] text-white px-6 py-2 rounded-lg hover:bg-[#6d28d9] transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}