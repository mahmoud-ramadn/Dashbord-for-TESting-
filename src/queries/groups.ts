import { useQuery } from "@tanstack/react-query"

import { getGroups } from "@/apis/groups"
import { queryClient } from "@/components/global-provider/tanstack-provider"

export const GROUPS_QUERY_KEY = "groups"

export const useGroups = (search?: string) => {
    return useQuery({
        queryKey: [GROUPS_QUERY_KEY, search],
        queryFn: async () => {
            const queryMapping = search ? `search=${search}` : ""

            const response = await getGroups(queryMapping)

            return response
        },
    })
}

export const revalidateGroups = () => {
    queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] })
}
