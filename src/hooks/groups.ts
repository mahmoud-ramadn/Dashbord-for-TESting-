import { parseAsInteger, useQueryStates } from "nuqs"

import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getGroup, getGroups } from "@/apis/groups"

export const useGroupsQueryFilterState = () => {
    const [query] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
    })

    const mutate = (input: Partial<typeof query>) => {
        return {
            ...query,
            ...input,
        }
    }

    return { query, mutate }
}

export const useGroups = () => {
    const { query } = useGroupsQueryFilterState()

    return useAsyncRetry(async () => {
        const response = await getGroups(getParamsEncodedQuery(query))
        return response.data
    }, [query])
}

export const useGroup = (id: string) => {
    return useAsyncRetry(async () => {
        if (!id) return null

        const response = await getGroup(id)
        return response.data
    })
}
