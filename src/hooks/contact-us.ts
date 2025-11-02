import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getContactUs } from "@/apis/contact-us"

export const useContactUsQueryFilterState = () => {
    const [query, setQuery] = useQueryStates({
        search: parseAsString.withDefault(""),
        state: parseAsString.withDefault(""),
        page: parseAsInteger.withDefault(1),
        messageType: parseAsString.withDefault(""),
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

export const useContactUs = () => {
    const { query } = useContactUsQueryFilterState()
    return useAsyncRetry(async () => {
        const response = await getContactUs(getParamsEncodedQuery(query))
        return response.data
    }, [query])
}
