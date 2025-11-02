interface ApiResponse<T> {
    data: T
    message: string
    code: number
    success: boolean
}

interface PageInfo {
    totalPages: number
    currentPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    totalItems: number
}

interface PaginatedApiResponse<T> {
    data: {
        items: T[]
        pageInfo: PageInfo
    }
    message: string
    code: number
    success: boolean
}

interface ErrorResponse {
    data: {
        message: string
        code: number
        success: boolean
    }
}
