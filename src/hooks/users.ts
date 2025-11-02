import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getUser, getUsers } from "@/apis/users"

export const useUsersQueryFilterState = () => {
    const [query, setQuery] = useQueryStates({
        search: parseAsString.withDefault(""),
        state: parseAsString.withDefault(""),
        sortBy: parseAsString.withDefault(""),
        order: parseAsString.withDefault(""),
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

export const useUsers = () => {
    const { query } = useUsersQueryFilterState()
    return useAsyncRetry(async () => {
        const response = await getUsers(getParamsEncodedQuery(query))
        return response.data
    }, [query])
}

export const useUser = (id: string) => {
    return useAsyncRetry(async () => {
        if (!id) return null

        const response = await getUser(id)
        return response.data
    })
}
