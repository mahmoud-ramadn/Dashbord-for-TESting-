import { apiClient } from "@/lib/api-client"

export const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append("media", file)

    const response = await apiClient<UploadResponse[]>({
        url: "/upload",
        method: "POST",
        data: formData,
        auth: true,
    })
    return response
}

export const uploadQuestions = async (file: File, categoryId: string) => {
    const formData = new FormData()
    formData.append("sheet", file)

    if (categoryId) {
        formData.append("categoryId", categoryId)
    }

    const response = await apiClient<UploadResponse[]>({
        url: `/questions/upload/${categoryId}`,
        method: "POST",
        data: formData,
        auth: true,
    })

    return response
}
