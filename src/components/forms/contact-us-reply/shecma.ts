import { z } from "zod"

export const replayFormSchema = z.object({
    reply: z.string().min(2, { message: " الرد يجب أن يكون أطول من 2 حرف" }),
})

export type ReplayFormSchema = z.infer<typeof replayFormSchema>
