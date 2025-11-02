import { z } from "zod"

export const termsAndConditionsFormSchema = z.object({
    arContent: z.string().min(2, { message: "العنوان العربي يجب أن يكون أطول من 2 حرف" }),
    enContent: z.string().min(2, { message: "العنوان الانجليزي يجب أن يكون أطول من 2 حرف" }),
})

export type TermsAndConditionsFormSchema = z.infer<typeof termsAndConditionsFormSchema>
