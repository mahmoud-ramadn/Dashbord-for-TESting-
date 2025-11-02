interface LoginInputs {
    email: string
    password: string
}

interface LoginResponse {
    token: string
    user: UserResponse
}

interface UserResponse {
    id: string
    name: string
    avatar: string
    gender: string
    createdAt: string
    updatedAt: string
    deletedAt: string
    userAuthData: UserAuthData[]
    roles: Role[]
    userAuthData: UserAuthData[]
}

interface UserAuthData {
    email: string
    userAuthState: string
    createdAt: string
    updatedAt: string
    userId: string
}

interface Role {
    id: string
    name: string
    description: string
    permissions: Permission[]
    createdAt: string
    updatedAt: string
    deletedAt: string
}

interface Permission {
    id: string
    businessModule: string
    permission: string
    description: string
    createdAt: string
    updatedAt: string
    deletedAt: string
}

interface RolePermission {
    id: string
    name: string
    description: string
    createdAt: string
    updatedAt: string
    deletedAt: string
}
