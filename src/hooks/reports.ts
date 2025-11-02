// hooks/reports.ts
// import { useQuery } from "@tanstack/react-query"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

// import { toast } from "sonner"

// import { useEffect, useRef } from "react"
import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getReports } from "@/apis/reports"

export const useReportsQueryFilterState = () => {
    const [query, setQuery] = useQueryStates({
        search: parseAsString.withDefault(""),
        page: parseAsInteger.withDefault(1),
        reason: parseAsString.withDefault(""),
        sortBy: parseAsString.withDefault(""),
        status: parseAsString.withDefault(""), // Changed from 'state' to 'status'
        limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
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

export const useReports = (questionId?: string) => {
    const { query } = useReportsQueryFilterState()

    return useAsyncRetry(async () => {
        const apiParams = {
            search: query.search,
            reason: query.reason,
            page: query.page,
            limit: query.limit,
            status: query.status,
            sortBy: query.sortBy,
            order: query.order,
        }

        const queryString = getParamsEncodedQuery(apiParams)
        const response = await getReports(queryString, questionId)
        const data = response

        if (questionId) {
            return {
                items: Array.isArray(data) ? data : [data],
                pageInfo: { totalPages: 1 },
            }
        }

        return data
    }, [query, questionId])
}

// export const useReportsHandleNotification = () => {
//     const previousCountRef = useRef<number | null>(null)
//     const isFirstLoadRef = useRef(true)

//     const query = useQuery({
//         queryKey: ["reports"],
//         queryFn: () => getNewReportState(),
//     })

//     const reportsNotificationCount = query?.data?.items?.length || 0

//     useEffect(() => {
//         if (isFirstLoadRef.current) {
//             previousCountRef.current = reportsNotificationCount
//             isFirstLoadRef.current = false
//             return
//         }

//         if (query.isSuccess && previousCountRef.current !== null) {
//             const previousCount = previousCountRef.current
//             const newReportsCount = reportsNotificationCount - previousCount

//             if (newReportsCount > 0) {
//                 toast.success(`هناك ${newReportsCount} تقرير جديد لم تشاهده بعد!`)
//             }
//             previousCountRef.current = reportsNotificationCount
//         }
//     }, [reportsNotificationCount, query.isSuccess])

//     return {
//         query,
//         reportsNotificationCount,
//     }
// }
