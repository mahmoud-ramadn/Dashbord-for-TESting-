import { apiClient } from "@/lib/api-client"

export const getPackages = async (queryString: string) => {
    const response = await apiClient<PaginatedApiResponse<PackagesResponse>>({
        url: `/packages/?${queryString}`,
        method: "GET",
    })

    return response
}

export const getPackage = async (id: string) => {
    const response = await apiClient<ApiResponse<GamePackageResponse>>({
        url: `/packages/${id}`,
        method: "GET",
    })

    return response.data
}

export const createPackage = async (inputs: CreatePackageInputs) => {
    const response = await apiClient<ApiResponse<CreatePackageResponse>>({
        url: `/packages`,
        method: "POST",
        data: inputs,
        auth: true,
    })

    return response
}

export const updatePackage = async (id: string, inputs: Partial<CreatePackageInputs>) => {
    const response = await apiClient<ApiResponse<CreatePackageResponse>>({
        url: `/packages/${id}`,
        method: "PATCH",
        data: inputs,
    })
    return response
}

export const packagesSubscription = async (id: string) => {
    const response = await apiClient<ApiResponse<{ link: string }>>({
        url: `/packages/subscribe`,
        method: "POST",
        data: { gamePackageId: id },
    })
    return response.data.link
}
