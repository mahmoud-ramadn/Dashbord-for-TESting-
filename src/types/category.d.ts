type CategoryStatus = "ACTIVE" | "INACTIVE"
interface CreateCategoryInputs {
    arName: string
    enName: string
    groupId: string
    description?: string
    photo?: string | null
    state?: CategoryStatus
}

interface CategoryResponse {
    id: string
    arName: string
    enName: string
    description: string
    group: GroupResponse
    photo: string | null
    state?: CategoryStatus
}
