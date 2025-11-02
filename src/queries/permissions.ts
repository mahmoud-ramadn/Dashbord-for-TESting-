import { useQuery } from "@tanstack/react-query"

import { getPermissions } from "@/apis/permissions"

export const PERMISSIONS_QUERY_KEY = "permissions"

export const usePermissions = (search?: string) => {
    return useQuery({
        queryKey: [PERMISSIONS_QUERY_KEY, search],
        queryFn: async () => {
            const queryMapping = search ? `search=${search}` : ""

            const response = await getPermissions(queryMapping)

            return response?.data
        },
    })
}
