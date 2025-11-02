import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getPackage, getPackages } from "@/apis/packages"

export const usePackagesQueryFilterState = () => {
    const [query, setQuery] = useQueryStates({
        search: parseAsString.withDefault(""),
        state: parseAsString.withDefault(""),
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
        sortBy: parseAsString.withDefault(""),
        order: parseAsString.withDefault(""),
    })

    const mutate = (input: Partial<typeof query>) => {
        setQuery({
            ...query,
            ...input,
        })
    }

    return { query, mutate }
}

export const usePackages = () => {
    const { query } = usePackagesQueryFilterState()

    return useAsyncRetry(async () => {
        const response = await getPackages(getParamsEncodedQuery(query))
        return response.data
    }, [query])
}

export const usePackage = (id: string) => {
    return useAsyncRetry(async () => {
        if (!id) return null
        const response = await getPackage(id)
        return response
    }, [id])
}
