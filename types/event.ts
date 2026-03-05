export type Event = {
    id: string
    title: string
    content: string
    imagePath: string | null
    endDate: Date | string
    isApproved: boolean
    createdAt: Date | string
    likeCount: number
    isLikedByUser: boolean
    author: {
        name: string | null
        email: string
        role: string
    }
    university: {
        name: string
        shortName: string
    }
}