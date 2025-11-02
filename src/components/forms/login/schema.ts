import { z } from "zod"

export const loginFormSchema = z.object({
    email: z.string().email({
        message: "البريد الإلكتروني غير صالح",
    }),
    password: z.string().min(8, {
        message: "كلمة المرور غير صالحة",
    }),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>
