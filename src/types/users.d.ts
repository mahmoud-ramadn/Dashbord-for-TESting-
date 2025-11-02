interface User {
    id: string
    name: string
    avatar: string | null
    gender: "MALE" | "FEMALE" | string
    availableGamesCount: number
    phone: string | null
    phoneVerified: boolean
    phoneVerificationCode: string | null
    phoneVerificationExpiresAt: string | null
    roleClass: "USER" | "ADMIN" | string
    state: UsersStatus
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    roleId: string | null
    userAuthentications: UserAuthentication[]
    roles: Role[]
}

interface UserAuthentication {
    email: string
    password: string
    userAuthState: UsersStatus
    createdAt: string
    updatedAt: string
    userId: string
}

interface CreateUserInputs {
    name: string
    email: string
    state?: UsersStatus
}

type UsersStatus = "ACTIVE" | "INACTIVE"
