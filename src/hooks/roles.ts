import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getRole, getRoles } from "@/apis/roles"

export const useRolesSearchQueryFilterState = () => {
    const [query, setQuery] = useQueryStates({
        search: parseAsString.withDefault(""),
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
    })

    const mutate = (input: Partial<typeof query>) => {
        setQuery({
            ...query,
            ...input,
        })
    }

    return { query, mutate }
}

export const useRoles = () => {
    const { query } = useRolesSearchQueryFilterState()
    return useAsyncRetry(async () => {
        const response = await getRoles(getParamsEncodedQuery(query))
        return response.data
    }, [query])
}

export const useRole = (id: string) => {
    return useAsyncRetry(async () => {
        if (!id) return null

        const response = await getRole(id)
        return response.data
    })
}
