import { apiClient } from "@/lib/api-client"

export const getPackageAnalytics = async (queryString?: string) => {
    const response = await apiClient<ApiResponse<PackageAnalyticsResponse>>({
        url: `/packages/analytics?${queryString}`,
        method: "GET",
    })
    return response.data
}

export const getPackageAnalyticsPdf = async () => {
    const response = await apiClient({
        url: `/packages/analytics/pdf`,
        method: "GET",
    })
    return response
}
