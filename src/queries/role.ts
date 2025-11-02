import { useQuery } from "@tanstack/react-query"

import { getRoles } from "@/apis/roles"
import { queryClient } from "@/components/global-provider/tanstack-provider"

export const ROLES_QUERY_KEY = "roles"

export const useQueryRoles = (search?: string) => {
    return useQuery({
        queryKey: [ROLES_QUERY_KEY, search],
        queryFn: async () => {
            const queryMapping = search ? `search=${search}` : ""

            const response = await getRoles(queryMapping)

            return response
        },
    })
}

export const revalidateRoles = () => {
    queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] })
}
