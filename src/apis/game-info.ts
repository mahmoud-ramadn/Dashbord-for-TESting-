import { apiClient } from "@/lib/api-client"

export const getGameInfo = async () => {
    const response = await apiClient<GameInfoResponse>({
        url: `/game-info`,
        method: "GET",
    })
    return response.data
}

export const UpdateGameInfo = async (data: Partial<GameINfoInputs>) => {
    const response = await apiClient<GameInfoResponse>({
        url: `/game-info`,
        method: "PUT",
        data,
    })
    return response
}
