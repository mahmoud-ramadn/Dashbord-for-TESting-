import { apiClient } from "@/lib/api-client"

export const getPermissions = async (queryString?: string) => {
    const response = await apiClient<ApiResponse<PermissionResponse[]>>({
        url: `/permissions?${queryString}`,
        method: "GET",
    })
    return response
}
