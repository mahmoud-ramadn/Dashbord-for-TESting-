import { z } from "zod"

export const policiesFormSchema = z.object({
    arContent: z.string().min(2, { message: "العنوان العربي يجب أن يكون أطول من 2 حرف" }),
    enContent: z.string().min(2, { message: "العنوان الانجليزي يجب أن يكون أطول من 2 حرف" }),
})

export type PoliciesFormSchema = z.infer<typeof policiesFormSchema>
