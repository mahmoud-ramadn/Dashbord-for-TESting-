type QuestionStatus = "ACTIVE" | "INACTIVE"

interface QuestionResponse {
    id: string
    name: string
    answer: string
    photo: string | null
    answerPhoto: string | null
    category: CategoryResponse
    questionComments: QuestionCommentResponse[]
    level: LEVELS
    state: QuestionStatus
}

interface CreateQuestionInputs {
    name?: string | null
    answer?: string | null
    categoryId: string
    photo?: string | null
    answerPhoto?: string | null
    state?: QuestionStatus
}

interface CreateQuestionCommentInputs {
    comment: string
}

interface QuestionCommentResponse {
    id: string
    comment: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    questionId: string
    createdByUserId: string
    updatedByUserId: string | null
    createdByUser: UserResponse
}

interface QuestionsFilter {
    categoryId?: string
}
