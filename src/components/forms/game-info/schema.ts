import { z } from "zod"

export const GameInfoFormSchema = z.object({
    brief: z.string().min(2, { message: "الوصف يجب أن يكون أطول من 2 حرف" }),
})

export type GameInfoFormSchemaType = z.infer<typeof GameInfoFormSchema>
