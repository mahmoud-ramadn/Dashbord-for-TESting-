import { z } from "zod"

export const groupFormSchema = z.object({
    arName: z.string().min(2, { message: "العنوان العربي يجب أن يكون أطول من 2 حرف" }),
    enName: z.string().min(2, { message: "العنوان الانجليزي يجب أن يكون أطول من 2 حرف" }),
    description: z.string().optional(),
})

export type GroupFormSchema = z.infer<typeof groupFormSchema>
