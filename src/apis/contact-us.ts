import { apiClient } from "@/lib/api-client"

export const getContactUs = async (queryString?: string) => {
    const response = await apiClient<PaginatedApiResponse<ContactUsResponse>>({
        url: `/contact-us/?${queryString}`,
        method: "GET",
    })
    return response
}

export const createReply = async (id: string, inputs: CreateReplayInputs) => {
    const response = await apiClient<ApiResponse<ContactUsResponse>>({
        url: `/contact-us/reply/${id}/`,
        method: "POST",
        data: inputs,
    })
    return response
}
