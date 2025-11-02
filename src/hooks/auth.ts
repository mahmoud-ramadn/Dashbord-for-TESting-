import { useSetAtom } from "jotai"

import { useState } from "react"
import { useEffectOnce } from "react-use"

import { getUserByToken } from "@/apis/auth"
import { userAtom } from "@/atoms"

export const useGetUserByToken = () => {
    const token = localStorage.getItem("token")

    const [loading, setLoading] = useState(!!token)
    const setUser = useSetAtom(userAtom)

    useEffectOnce(() => {
        ;(async () => {
            try {
                setLoading(true)
                if (!token) return

                const response = await getUserByToken()
                setUser(response?.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        })()
    })

    return {
        loading,
    }
}
