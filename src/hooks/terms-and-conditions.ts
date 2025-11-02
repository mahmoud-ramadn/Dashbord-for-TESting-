import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getTermsAndConditions, getTermsAndConditionsById } from "@/apis/terms-and-conditions"

export const useTermsAndConditionsSearchQueryFilterState = () => {
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

export const useTermsAndConditions = () => {
    const { query } = useTermsAndConditionsSearchQueryFilterState()

    return useAsyncRetry(async () => {
        const response = await getTermsAndConditions(getParamsEncodedQuery(query))
        return response.data
    }, [query])
}

export const useTermsAndConditionsById = (id: string) => {
    return useAsyncRetry(async () => {
        if (!id) return null

        const response = await getTermsAndConditionsById(id)
        return response.data
    })
}
