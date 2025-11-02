import { apiClient } from "@/lib/api-client"

export const getCategory = async (id: string) => {
    const response = await apiClient<ApiResponse<CategoryResponse>>({
        url: `/categories/${id}`,
        method: "GET",
    })
    return response
}

export const getCategories = async (queryString?: string) => {
    const response = await apiClient<PaginatedApiResponse<CategoryResponse>>({
        url: `/categories?${queryString}`,
        method: "GET",
    })
    return response
}

export const createCategory = async (inputs: CreateCategoryInputs) => {
    const response = await apiClient<ApiResponse<CategoryResponse>>({
        url: "/categories",
        method: "POST",
        data: inputs,
    })
    return response
}

export const updateCategory = async (id: string, inputs: Partial<CreateCategoryInputs>) => {
    const response = await apiClient<ApiResponse<CategoryResponse>>({
        url: `/categories/${id}`,
        method: "PATCH",
        data: inputs,
    })
    return response
}

export const deleteCategory = async (id: string) => {
    const response = await apiClient<ApiResponse<CategoryResponse>>({
        url: `/categories/${id}`,
        method: "DELETE",
    })
    return response
}
