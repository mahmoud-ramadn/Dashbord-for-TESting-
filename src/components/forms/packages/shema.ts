import { z } from "zod"

export const PackageFormSchema = z.object({
    arName: z.string().min(2, { message: "الإسم العربي يجب أن يكون أطول من 2 حرف" }),
    enName: z.string().min(2, { message: "الإسم الإنجليزي يجب أن يكون أطول من 2 حرف" }),
    photo: z.union([z.string().url({ message: "الرابط غير صالح" }), z.instanceof(File)]).optional(),
    price: z.coerce.number().min(1, { message: "السعر يجب أن يكون أكبر من 1" }),
    games: z.coerce.number().min(1, { message: "يجب أن يكون عدد الألعاب أكبر من واحد" }),
    description: z.string().optional(),
    discountPercentage: z.coerce.number().optional(),
})

export type PackageFormSchemaType = z.infer<typeof PackageFormSchema>
