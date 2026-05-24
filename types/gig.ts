export type Gig = {
    id: string
    title: string
    description: string
    imagePath: string | null
    priceType: string // "FIXED" | "RANGE" | "NEGOTIABLE"
    minPrice: number | null
    maxPrice: number | null
    contactNo: string
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
    university: {
        id: string
        name: string
        shortName: string
    }
}
