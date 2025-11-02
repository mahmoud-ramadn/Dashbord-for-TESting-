interface RoleResponse {
    id: string
    name: string
    description: string
    permissions: PermissionResponse[]
    state: string
    createdAt: string
    updatedAt: string
    createdByUserId: string | null
    updatedByUserId: string | null
    deletedAt: string | null
    usersCount: number
}

interface CreateRoleInputs {
    name: string
    description?: string
    permissions: string[]
}
