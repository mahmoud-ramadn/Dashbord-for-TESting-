import { apiClient } from "@/lib/api-client"

export const getPoliciesById = async (id: string) => {
    const response = await apiClient<ApiResponse<PoliciesResponse>>({
        url: `/policies/${id}`,
        method: "GET",
    })
    return response
}

export const getPolicies = async (queryString?: string) => {
    const response = await apiClient<PaginatedApiResponse<PoliciesResponse>>({
        url: `/policies?${queryString}`,
        method: "GET",
    })
    return response
}

export const createPolicies = async (inputs: CreatePoliciesInputs) => {
    const response = await apiClient<ApiResponse<PoliciesResponse>>({
        url: "/policies",
        method: "POST",
        data: inputs,
    })
    return response
}

export const updatePolicies = async (id: string, inputs: Partial<CreatePoliciesInputs>) => {
    const response = await apiClient<ApiResponse<PoliciesResponse>>({
        url: `/policies/${id}`,
        method: "PATCH",
        data: inputs,
    })
    return response
}
