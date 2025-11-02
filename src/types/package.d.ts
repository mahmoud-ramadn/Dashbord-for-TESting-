type PackageItem = {
    id: string // UUID
    arName: string
    enName: string
    photo: string
    price: number
    state: "ACTIVE" | "INACTIVE"
    games: number
    description: string | null
    discountPercentage: number
    paidCount: number
    createdAt: string
    updatedAt: string
    createdByUserId: string | null
    updatedByUserId: string | null
}

type PageInfo = {
    totalPages: number
    currentPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    totalItems: number
}

interface PackagesResponse {
    id: string // UUID
    arName: string
    enName: string
    photo: string
    price: number
    state: "ACTIVE" | "INACTIVE"
    games: number
    description: string | null
    discountPercentage: number
    paidCount: number
    createdAt: string
    updatedAt: string
    createdByUserId: string | null
    updatedByUserId: string | null
}

interface GamePackageResponse {
    id: string
    arName: string
    enName: string
    photo: string
    price: number
    state: "ACTIVE" | "INACTIVE"
    games: number
    description: string
    discountPercentage: number
    paidCount: number
    createdAt: string
    updatedAt: string
    createdByUserId: string
    updatedByUserId: string | null
}

interface CreatePackageInputs {
    id: string
    arName: string
    enName: string
    photo?: string
    price: number
    games: number
    state?: PackageStatus
    description?: string
    discountPercentage?: number
}

interface CreatePackageResponse {
    id: string
    arName: string
    enName: string
    photo: string
    price: number
    state: "ACTIVE" | "INACTIVE"
    games: number
    description: string
    discountPercentage: number
    paidCount: number
    createdAt: string
    updatedAt: string
    createdByUserId: string
    updatedByUserId: string | null
}

type PackageStatus = "ACTIVE" | "INACTIVE"
