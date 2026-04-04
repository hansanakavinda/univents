'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
    eventId: string
    initialLikeCount: number
    initialIsLiked: boolean
    currentUserId?: string
}

export function LikeButton({ eventId, initialLikeCount, initialIsLiked, currentUserId }: LikeButtonProps) {
    const router = useRouter()
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [likeCount, setLikeCount] = useState(initialLikeCount)

    const handleLike = async () => {
        if (!currentUserId) {
            router.push('/login')
            return
        }

        // Optimistic update
        const wasLiked = isLiked
        setIsLiked(!wasLiked)
        setLikeCount(prev => wasLiked ? prev - 1 : prev + 1)

        try {
            const response = await fetch('/api/events/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId }),
            })

            if (!response.ok) {
                throw new Error('Failed to toggle like')
            }

            const data = await response.json()

            // Sync with server state
            setIsLiked(data.liked)
            setLikeCount(data.likeCount)
        } catch {
            // Rollback on failure
            setIsLiked(wasLiked)
            setLikeCount(prev => wasLiked ? prev + 1 : prev - 1)
        }
    }

    return (
        <button
            onClick={handleLike}
            className="flex items-center space-x-2 group transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            title={currentUserId ? (isLiked ? 'Unlike' : 'Like') : 'Sign in to like'}
        >
            <svg
                className={`w-6 h-6 transition-colors duration-200 ${isLiked
                    ? 'text-red-500 fill-red-500'
                    : 'text-gray-400 fill-none group-hover:text-red-400'
                    }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                {likeCount > 0 ? likeCount : ''}
            </span>
        </button>
    )
}
