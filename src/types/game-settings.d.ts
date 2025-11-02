interface GameSettingsResponse {
    code: number
    success: boolean
    message: string
    data: GameSettingsData
}

interface GameSettingsData {
    id: string
    easyPoints?: number
    mediumPoints?: number
    hardPoints?: number
    timePerQuestionSeconds?: number
    timeExtensionSeconds?: number
    createdAt: string
    updatedAt: string
}

interface GameSettingsInput {
    easyPoints?: number
    mediumPoints?: number
    hardPoints?: number
    timePerQuestionSeconds?: number
    timeExtensionSeconds?: number
}
