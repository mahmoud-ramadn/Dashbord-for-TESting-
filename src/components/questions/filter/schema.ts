import { z } from "zod"

export const filterFormSchema = z.object({
    category: z.object({ label: z.string(), value: z.string() }).nullable().optional(),
    level: z.object({ label: z.string(), value: z.string() }).nullable().optional(),
    search: z.string().optional(),
    state: z.boolean().optional(),
    hasComments: z.boolean().optional(),
})

export type FilterFormSchema = z.infer<typeof filterFormSchema>
