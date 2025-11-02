import { z } from "zod"

export enum GENDER {
    MALE = "MALE",
    FEMALE = "FEMALE",
}
export const genderOptions = [
    { label: "ذكر", value: GENDER.MALE },
    { label: "أنثى", value: GENDER.FEMALE },
]

export const userFormSchema = (isCreate: boolean = false) => {
    return z
        .object({
            name: z.string().min(2, { message: "العنوان العربي يجب أن يكون أطول من 2 حرف" }),
            email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
            phone: z.string().min(10, { message: "الهاتف يجب أن يكون أطول من 10 حرف" }),
            gender: z.object({ label: z.string(), value: z.string() }).optional(),
            password: z.string(),
            role: z.object({ label: z.string(), value: z.string() }).optional(),
        })
        .refine((data) => data.gender, {
            message: "الجنس مطلوب",
            path: ["gender"],
        })
        .refine((data) => data.role, {
            message: "الدور مطلوب",
            path: ["role"],
        })
        .refine(
            (data) => {
                // Required when creating
                if (isCreate) {
                    return data.password && data.password.length >= 8
                }
                // When updating, only validate if password has a value
                if (data?.password) {
                    return data.password.length >= 8
                }
                // If no password provided during update, it's valid (optional)
                return true
            },
            {
                message: "كلمة المرور يجب أن يكون أطول من 8 حرف",
                path: ["password"],
            }
        )
}

export type UserFormSchema = z.infer<ReturnType<typeof userFormSchema>>
