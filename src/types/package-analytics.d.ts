interface PackageAnalyticsItem {
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
    createdByUserId: string | null
    updatedByUserId: string | null
    amount: number
    count: number
}

interface PackageAnalyticsResponse {
    packageAnalytics: PackageAnalyticsItem[]
    summary: {
        totalAmount: number
        totalCounts: number
    }
}
