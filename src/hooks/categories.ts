import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getCategories, getCategory } from "@/apis/categories"

export const useCategoryQueryFilterState = () => {
    const [query, setQuery] = useQueryStates({
        state: parseAsString.withDefault(""),
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

export const useCategories = () => {
    const { query } = useCategoryQueryFilterState()
    return useAsyncRetry(async () => {
        const response = await getCategories(getParamsEncodedQuery(query))
        return response.data
    }, [query])
}

export const useCategory = (id: string) => {
    return useAsyncRetry(async () => {
        if (!id) return null

        const response = await getCategory(id)
        return response.data
    })
}
