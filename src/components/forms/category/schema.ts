import { z } from "zod"

export const categoryFormSchema = z
    .object({
        arName: z.string().min(2, { message: "العنوان العربي يجب أن يكون أطول من 2 حرف" }),
        enName: z.string().min(2, { message: "العنوان الانجليزي يجب أن يكون أطول من 2 حرف" }),
        group: z.object({ label: z.string(), value: z.string() }).optional(),
        description: z.string().optional(),
        photo: z.union([z.string(), z.instanceof(File)]).optional(),
    })
    .refine((data) => data.group, {
        message: "المجموعة مطلوبة",
        path: ["group"],
    })

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>
