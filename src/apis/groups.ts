import { apiClient } from "@/lib/api-client"

export const getGroup = async (id: string) => {
    const response = await apiClient<ApiResponse<GroupResponse>>({
        url: `/groups/${id}`,
        method: "GET",
    })
    return response
}

export const getGroups = async (queryString?: string) => {
    const response = await apiClient<PaginatedApiResponse<GroupResponse>>({
        url: `/groups?${queryString}`,
        method: "GET",
    })
    return response
}

export const createGroup = async (inputs: CreateGroupInputs) => {
    const response = await apiClient<ApiResponse<GroupResponse>>({
        url: "/groups",
        method: "POST",
        data: inputs,
    })
    return response
}

export const updateGroup = async (id: string, inputs: Partial<CreateGroupInputs>) => {
    const response = await apiClient<ApiResponse<GroupResponse>>({
        url: `/groups/${id}`,
        method: "PATCH",
        data: inputs,
    })
    return response
}
