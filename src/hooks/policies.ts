import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getPolicies, getPoliciesById } from "@/apis/policies"

export const usePoliciesSearchQueryFilterState = () => {
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

export const usePolicies = () => {
    const { query } = usePoliciesSearchQueryFilterState()

    return useAsyncRetry(async () => {
        const response = await getPolicies(getParamsEncodedQuery(query))
        return response.data
    }, [query])
}

export const usePoliciesById = (id: string) => {
    return useAsyncRetry(async () => {
        if (!id) return null
        const response = await getPoliciesById(id)
        return response.data
    })
}
