import { z } from "zod"

export const commentFormSchema = z.object({
    comment: z.string().min(2, { message: "التعليق يجب أن يكون أطول من 2 حرف" }),
})

export type CommentFormSchema = z.infer<typeof commentFormSchema>
