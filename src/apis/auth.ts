import { apiClient } from "@/lib/api-client"

export const login = async (inputs: LoginInputs) => {
    const response = await apiClient<ApiResponse<LoginResponse>>({
        url: "/auth/login",
        method: "POST",
        data: inputs,
        auth: false,
    })
    return response
}

export const getUserByToken = async () => {
    const response = await apiClient<ApiResponse<UserResponse>>({
        url: "/auth/me",
        method: "GET",
    })
    return response
}
