import { parseAsBoolean, parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { useAsyncRetry } from "react-use"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { getParamsEncodedQuery } from "@/lib/map"

import { getQuestion, getQuestions } from "@/apis/questions"

export const useQuestionsQueryFilterState = () => {
    const [query, setQuery] = useQueryStates({
        search: parseAsString.withDefault(""),
        state: parseAsString.withDefault(""),
        categoryLabel: parseAsString.withDefault(""),
        categoryValue: parseAsString.withDefault(""),
        levelLabel: parseAsString.withDefault(""),
        levelValue: parseAsString.withDefault(""),
        hasComments: parseAsBoolean.withDefault(false),
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

export const useQuestions = (filter?: QuestionsFilter) => {
    const { query } = useQuestionsQueryFilterState()

    return useAsyncRetry(async () => {
        const apiParams = {
            search: query.search,
            ...(query.hasComments && { hasComments: "true" }),
            page: query.page,
            limit: query.limit,
            categoryId: query.categoryValue,
            ...(filter?.categoryId && { categoryId: filter.categoryId }),
            level: query.levelValue || "",
            state: query.state,
        }

        const response = await getQuestions(getParamsEncodedQuery(apiParams))
        return response.data
    }, [query])
}

export const useQuestion = (id: string) => {
    return useAsyncRetry(async () => {
        if (!id) return null

        const response = await getQuestion(id)
        return response.data
    })
}
