export type Hustle = {
    id: string
    title: string
    description: string
    hustleType: string // "INTERNSHIP" | "FREELANCE" | "PART_TIME" | "ONE_TIME"
    workMode: string // "REMOTE" | "ON_SITE" | "HYBRID"
    priceType: string | null // "FIXED" | "RANGE"
    minPrice: number | null
    maxPrice: number | null
    contactNo: string | null
    categoryId: string
    category: {
        id: string
        name: string
    }
    isApproved: boolean
    createdAt: Date | string
    authorId: string
    author: {
        name: string | null
        email: string
        role: string
    }
    imagePath: string | null
}

export type HustleCategory = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    _count?: {
        hustles: number
    }
}
