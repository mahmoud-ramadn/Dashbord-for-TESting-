import { apiClient } from "@/lib/api-client"

export const getNotificationsCount = async () => {
    const response = await apiClient<ApiResponse<number>>({
        url: `notifications/unseen-count`,
        method: "GET",
    })
    return response.data
}

export const getNotifications = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiClient<PaginatedApiResponse<any>>({
        url: `notifications`,
        method: "GET",
    })

    return response.data
}
