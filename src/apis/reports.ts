import { apiClient } from "@/lib/api-client"
import type { QuestionReportStatus } from "@/lib/reports"

export const getReports = async (queryString?: string, questionId?: string) => {
    const url = questionId ? `/questions/reports/${questionId}?${queryString}` : `/questions/reports?${queryString}`

    const response = await apiClient<PaginatedApiResponse<ReportResponse>>({
        url,
        method: "GET",
    })

    return response.data
}

// export const getNewReportState = async () => {
//     const response = await apiClient<PaginatedApiResponse<ReportResponse>>({
//         url: "questions/reports?status=NEW",
//         method: "GET",
//     })
//     return response.data
// }

export type CreateReportQuestionInputs = {
    reason: QuestionReportStatus
    selectedAnswer: string
    details: string
    gameId?: string
}

export const createReportQuestion = async (questionId: string, data: Partial<CreateReportQuestionInputs>) => {
    const response = await apiClient<ApiResponse<ReportResponse>>({
        url: `/questions/report/${questionId}`,
        method: "POST",
        data,
    })

    return response
}

export type EditReportInputs = {
    status: QuestionReportStatus | "RESOLVED"
    dismissedNote?: string
}
export const updateReportQuestionState = async (reportId: string, inputs: Partial<EditReportInputs>) => {
    const response = await apiClient<ApiResponse<ReportResponse>>({
        url: `/questions/reports/${reportId}`,
        method: "PATCH",
        data: inputs,
    })

    return response
}
