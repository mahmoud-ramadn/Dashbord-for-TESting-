import { apiClient } from "@/lib/api-client"

export const getRoles = async (queryString?: string) => {
    const response = await apiClient<PaginatedApiResponse<RoleResponse>>({
        url: `/roles?${queryString}`,
        method: "GET",
    })
    return response
}

export const createRole = async (inputs: CreateRoleInputs) => {
    const response = await apiClient<ApiResponse<RoleResponse>>({
        url: "/roles",
        method: "POST",
        data: inputs,
    })
    return response
}

export const updateRole = async (id: string, inputs: Partial<CreateRoleInputs>) => {
    const response = await apiClient<ApiResponse<RoleResponse>>({
        url: `/roles/${id}`,
        method: "PATCH",
        data: inputs,
    })
    return response
}

export const getRole = async (id: string) => {
    const response = await apiClient<ApiResponse<RoleResponse>>({
        url: `/roles/${id}`,
        method: "GET",
    })
    return response
}
