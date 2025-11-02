import { format } from "date-fns"
import { ar } from "date-fns/locale"
import QueryString from "qs"

export type IParams = Record<string, undefined | string | number | Array<string | number>>

/**
 * Filters the params from empty ones, and encode the arrays if any with the indices format
 */
export function getParamsEncodedQuery(params: IParams) {
    const nonEmptyParams: IParams = {}

    for (const [key, value] of Object.entries(params)) {
        const emptyArray = Array.isArray(value) && value?.length === 0

        if (value === undefined || value === null || value === "" || emptyArray) {
            continue
        } else {
            nonEmptyParams[key] = value
        }
    }

    return QueryString.stringify(nonEmptyParams, {
        arrayFormat: "indices",
        indices: true,
    })
}

export function formatDate(date: string) {
    return format(new Date(date), "dd MMMM yyyy - HH:mm a", { locale: ar })
}
