'use client'

import { useToast } from '@/components/ui/Toast'

interface ShareButtonProps {
    eventId: string
    title: string
}

export function ShareButton({ eventId, title }: ShareButtonProps) {
    const toast = useToast()

    const handleShare = async () => {
        const url = `${window.location.origin}/events/${eventId}`
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out ${title} on Univents!`,
                    url: url,
                })
            } catch (error) {
                // Web Share API throws an abort error if the user cancels the share dialog, which is expected.
                if ((error as Error).name !== 'AbortError') {
                    copyToClipboard(url)
                }
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            copyToClipboard(url)
        }
    }

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url)
            .then(() => toast.success('Link copied to clipboard!'))
            .catch(() => toast.error('Failed to copy link'))
    }

    return (
        <button
            onClick={handleShare}
            className="flex items-center space-x-2 group transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 text-gray-400 hover:text-blue-400"
            title="Share this event"
        >
            <svg
                className="w-6 h-6 transition-colors duration-200 fill-none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
            <span className="text-sm font-medium">
                Share
            </span>
        </button>
    )
}
