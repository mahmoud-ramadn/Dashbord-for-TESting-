import { z } from "zod"

import type { GroupedPermissionModule } from "./index.transform"

export const roleFormSchema = z.object({
    name: z.string().min(2, { message: "العنوان العربي يجب أن يكون أطول من 2 حرف" }),
    description: z.string().optional(),
    permissions: z
        .array(
            z.object({
                id: z.string(),
                businessModule: z.string(),
                permissions: z.array(z.object({ id: z.string(), value: z.string(), checked: z.boolean() })),
            }) satisfies z.ZodType<GroupedPermissionModule>
        )
        .refine(
            (permissions) => {
                // Check if at least one permission is checked across all modules
                return permissions?.some((module) => module?.permissions?.some((permission) => permission?.checked))
            },
            {
                message: "يجب تحديد صلاحية واحدة على الأقل",
            }
        ),
})

export type RoleFormSchema = z.infer<typeof roleFormSchema>
