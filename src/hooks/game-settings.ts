import { useAsyncRetry } from "react-use"

import { getGameSettings } from "@/apis/game-settings"

export const useGameSettings = () => {
    return useAsyncRetry(async () => {
        const response = await getGameSettings()
        return response
    })
}
