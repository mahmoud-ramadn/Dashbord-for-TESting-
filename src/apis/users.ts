import { apiClient } from "@/lib/api-client"

export const getUsers = async (queryString?: string) => {
    const response = await apiClient<PaginatedApiResponse<User>>({
        url: `/users/?${queryString}`,
        method: "GET",
    })
    return response
}

export const createUser = async (inputs: CreateUserInputs) => {
    const response = await apiClient<ApiResponse<User>>({
        url: "/users/board",
        method: "POST",
        data: inputs,
    })
    return response
}

export const updateUser = async (id: string, inputs: Partial<CreateUserInputs>) => {
    const response = await apiClient<ApiResponse<User>>({
        url: `/users/${id}`,
        method: "PATCH",
        data: inputs,
    })
    return response
}

export const getUser = async (id: string) => {
    const response = await apiClient<ApiResponse<User>>({
        url: `/users/${id}`,
        method: "GET",
    })
    return response
}
