import { apiClient } from "@/lib/api-client"

export const getQuestions = async (queryString: string) => {
    const response = await apiClient<PaginatedApiResponse<QuestionResponse>>({
        url: `/questions?${queryString}`,
        method: "GET",
    })

    return response
}

export const getQuestion = async (id: string) => {
    const response = await apiClient<ApiResponse<QuestionResponse>>({
        url: `/questions/${id}`,
        method: "GET",
    })

    return response
}

export const createQuestion = async (inputs: CreateQuestionInputs) => {
    const response = await apiClient<ApiResponse<QuestionResponse>>({
        url: "/questions",
        method: "POST",
        data: inputs,
    })

    return response
}

export const updateQuestion = async (id: string, inputs: Partial<CreateQuestionInputs>) => {
    const response = await apiClient<ApiResponse<QuestionResponse>>({
        url: `/questions/${id}`,
        method: "PATCH",
        data: inputs,
    })

    return response
}

export const deleteQuestion = async (id: string) => {
    const response = await apiClient<ApiResponse<QuestionResponse>>({
        url: `/questions/${id}`,
        method: "DELETE",
    })

    return response
}

export const createQuestionComment = async (id: string, inputs: CreateQuestionCommentInputs) => {
    const response = await apiClient<ApiResponse<QuestionCommentResponse>>({
        url: `/questions/comment/${id}`,
        method: "POST",
        data: inputs,
    })

    return response
}

export const updateQuestionComment = async (id: string, inputs: CreateQuestionCommentInputs) => {
    const response = await apiClient<ApiResponse<QuestionCommentResponse>>({
        url: `/questions/comment/${id}`,
        method: "PATCH",
        data: inputs,
    })

    return response
}

export const deleteQuestionComment = async (id: string) => {
    const response = await apiClient<ApiResponse<{ message: string }>>({
        url: `/questions/comment/${id}`,
        method: "DELETE",
    })

    return response
}
