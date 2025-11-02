import { apiClient } from "@/lib/api-client"

export const getTermsAndConditionsById = async (id: string) => {
    const response = await apiClient<ApiResponse<TermsAndConditionsResponse>>({
        url: `/terms-and-conditions/${id}`,
        method: "GET",
    })
    return response
}

export const getTermsAndConditions = async (queryString?: string) => {
    const response = await apiClient<PaginatedApiResponse<TermsAndConditionsResponse>>({
        url: `/terms-and-conditions?${queryString}`,
        method: "GET",
    })
    return response
}

export const createTermsAndConditions = async (inputs: CreateTermsAndConditionsInputs) => {
    const response = await apiClient<ApiResponse<TermsAndConditionsResponse>>({
        url: "/terms-and-conditions",
        method: "POST",
        data: inputs,
    })
    return response
}

export const updateTermsAndConditions = async (id: string, inputs: Partial<CreateTermsAndConditionsInputs>) => {
    const response = await apiClient<ApiResponse<TermsAndConditionsResponse>>({
        url: `/terms-and-conditions/${id}`,
        method: "PATCH",
        data: inputs,
    })
    return response
}

export const deleteTermsAndConditions = async (id: string) => {
    const response = await apiClient<ApiResponse<TermsAndConditionsResponse>>({
        url: `/terms-and-conditions/${id}`,
        method: "DELETE",
    })
    return response
}
