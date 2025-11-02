import { useQuery } from "@tanstack/react-query"

import { getCategories } from "@/apis/categories"
import { queryClient } from "@/components/global-provider/tanstack-provider"

export const CATEGORIES_QUERY_KEY = "categories"

export const useCategories = (search?: string) => {
    return useQuery({
        queryKey: [CATEGORIES_QUERY_KEY, search],
        queryFn: async () => {
            const queryMapping = search ? `search=${search}` : ""

            const response = await getCategories(queryMapping)

            return response
        },
    })
}

export const revalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] })
}
