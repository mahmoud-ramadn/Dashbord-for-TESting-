import { apiClient } from "@/lib/api-client"

export const getGameSettings = async () => {
    const response = await apiClient<GameSettingsResponse>({
        url: "/game-settings",
        method: "GET",
    })
    return response.data
}

export const updateGameSettings = async (data: GameSettingsInput) => {
    const response = await apiClient<GameSettingsResponse>({
        url: "/game-settings",
        method: "PATCH",
        data,
    })
    return response.data
}
