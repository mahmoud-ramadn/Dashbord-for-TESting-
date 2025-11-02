import { apiClient } from "@/lib/api-client"

export const dummyPosts = async () => {
    const response = await apiClient<Post[]>({
        method: "GET",
        url: "http://localhost:3001/posts",
    })

    return response
}
