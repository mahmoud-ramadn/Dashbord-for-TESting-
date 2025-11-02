import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getPackageAnalytics } from "@/apis/package-analytics"

export const usePackageAnalyticsQueryFilterState = () => {
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

export const usePackagesAnalytics = () => {
    const { query } = usePackageAnalyticsQueryFilterState()
    return useAsyncRetry(async () => {
        const response = await getPackageAnalytics(getParamsEncodedQuery(query))
        return response
    }, [query])
}
