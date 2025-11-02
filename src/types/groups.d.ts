interface CreateGroupInputs {
    arName: string
    enName: string
    description?: string
}

interface GroupResponse {
    id: string
    arName: string
    enName: string
    description: string
}
