import { useAsyncRetry } from "react-use"

import { getGameInfo } from "@/apis/game-info"

export const useGameInfo = () => {
    return useAsyncRetry(async () => {
        const response = await getGameInfo()
        return response
    })
}
