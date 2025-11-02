import { z } from "zod"

import { LEVELS } from "@/lib/constants"

export const questionFormSchema = (isCategoryRequired: boolean = true) => {
    return z
        .object({
            name: z.string().optional(),
            photo: z.union([z.string(), z.instanceof(File)]).optional(),
            category: z
                .object({ label: z.string(), value: z.string() })
                .optional()
                .refine((val) => (isCategoryRequired ? val?.value !== undefined : true), {
                    message: "التصنيف مطلوب",
                }),
            answer: z.string().optional(),
            answerPhoto: z.union([z.string(), z.instanceof(File)]).optional(),
            level: z.nativeEnum(LEVELS, {
                message: "المستوى مطلوب",
            }),
        })
        .superRefine((data, ctx) => {
            if (!(data.name || data.photo)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "الاسم أو الصورة مطلوب",
                    path: ["name"],
                })
            }
            if (!(data.answer || data.answerPhoto)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "الإجابة أو الصورة مطلوب",
                    path: ["answer"],
                })
            }
        })
}

export type QuestionFormSchema = z.infer<ReturnType<typeof questionFormSchema>>
