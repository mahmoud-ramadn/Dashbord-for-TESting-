import { useAsyncRetry } from "react-use"

import { getNotifications, getNotificationsCount } from "@/apis/notifications"

export const useNotificationsCount = () => {
    return useAsyncRetry(async () => {
        const response = await getNotificationsCount()
        return response
    })
}

export const useNotifications = () => {
    return useAsyncRetry(async () => {
        const response = await getNotifications()
        return response
    })
}
