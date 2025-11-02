interface GameInfoResponse {
    code: number
    success: boolean
    message: string
    data: {
        id: string
        brief: string
    }
}

interface GameINfoInputs {
    id: string
    brief: string
}
