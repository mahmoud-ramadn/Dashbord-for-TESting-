import { useQuery } from "@tanstack/react-query"

import { dummyPosts } from "@/apis/dummy"

export const useDummyPosts = () => {
    return useQuery({
        queryKey: ["dummyPosts"],
        queryFn: dummyPosts,
    })
}
