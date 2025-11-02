import { useQuery } from "@tanstack/react-query"
import { useAtomValue, useSetAtom } from "jotai"

import { getUserByToken } from "@/apis/auth"
import { tokenAtom, userAtom } from "@/atoms"

export const USER_QUERY_KEY = "user"

export const useGetUserByToken = () => {
    const token = useAtomValue(tokenAtom)
    const setUser = useSetAtom(userAtom)

    return useQuery({
        queryKey: [USER_QUERY_KEY],
        queryFn: async () => {
            const response = await getUserByToken()

            setUser(response?.data)
            return response?.data
        },
        enabled: !!token,
    })
}
