export type Product = {
    id: string
    title: string
    description: string
    imagePath: string | null
    priceType: string // "FIXED" | "NEGOTIABLE"
    price: number | null
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

export type ProductCategory = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    _count?: {
        products: number
    }
}
