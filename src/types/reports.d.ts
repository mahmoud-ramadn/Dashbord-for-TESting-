type ReportResponse = {
    id: string
    reason: "MULTIPLE_CORRECT_ANSWERS" | "THE_CORRECT_ANSWER_IS_WRONG" | string
    details: string
    selectedAnswer: string
    correctAnswerAtReport: string
    dismissedNote: string
    createdAt: string
    updatedAt: string
    questionId: string
    createdByUserId: string
    updatedByUserId: string | null
    gameId: string
    status: "NEW" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED"
    question: Question
    createdByUser: UserType
    updatedByUser: UserType | null
    game: Game
}

type Question = {
    id: string
    name: string
    answer: string
    level: "EASY" | "MEDIUM" | "HARD" | string
    state: "ACTIVE" | "INACTIVE" | string
    photo: string
    answerPhoto: string
    reportsCount?: number
    categoryId: string
    createdByUserId: string | null
    updatedByUserId: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

type UserType = {
    id: string
    name: string
    avatar: string | null
    gender: "MALE" | "FEMALE" | string
    availableGamesCount: number
    phone: string | null
    phoneVerified: boolean
    phoneVerificationCode: string | null
    phoneVerificationExpiresAt: string | null
    roleClass: "USER" | "ADMIN" | string
    state: "ACTIVE" | "INACTIVE" | string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    roleId: string | null
}

type Game = {
    id: string
    name: string
    team1Name: string
    team2Name: string
    team1Count: number
    team2Count: number
    team1Score: number
    team2Score: number
    turn: "TEAM1" | "TEAM2" | string
    state: "ACTIVE" | "INACTIVE" | string
    changeQuestion: "NONE" | string
    addTime: "NONE" | string
    doublePoints: "NONE" | string
    answeredQuestions: number
    createdAt: string
    updatedAt: string
    createdByUserId: string
}
