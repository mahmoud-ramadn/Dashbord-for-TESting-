import type { UserFormSchema } from "@/components/forms/user/schema"

export const userTransform = (inputs: UserFormSchema) => {
    return {
        name: inputs?.name,
        email: inputs?.email,
        roleId: inputs?.role?.value,
        phone: inputs?.phone,
        gender: inputs?.gender?.value,
        ...(inputs?.password && {
            password: inputs?.password,
            confirmPassword: inputs?.password,
        }),
    }
}
