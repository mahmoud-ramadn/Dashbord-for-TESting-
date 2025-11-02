import type { RoleFormSchema } from "./schema"

export const roleTransform = (inputs: RoleFormSchema) => {
    return {
        name: inputs?.name,
        description: inputs?.description,
        permissions: inputs?.permissions?.flatMap((module) =>
            module?.permissions?.filter((p) => p?.checked).map((p) => p?.id)
        ),
    }
}

export type RoleModalTransform = ReturnType<typeof roleModalTransform>

export type PermissionFieldType = { id: string; value: string; checked: boolean }

export type GroupedPermissionModule = {
    id: string
    businessModule: string
    permissions: PermissionFieldType[]
}

export const roleModalTransform = (permissions: PermissionResponse[], values?: RoleResponse | null) => {
    return Object.values(
        permissions.reduce((acc: Record<string, GroupedPermissionModule>, curr) => {
            const { businessModule, id, permission } = curr
            if (!acc[businessModule]) {
                acc[businessModule] = {
                    businessModule,
                    id,
                    permissions: [],
                }
            }

            // Assert the type of 'acc' to allow indexing with a string and access its properties safely.
            // The initial type of 'acc' is inferred as '{}', which doesn't have a string index signature.
            const typedAcc = acc as Record<string, GroupedPermissionModule>
            typedAcc[businessModule].permissions.push({
                id,
                value: permission,
                checked: values?.permissions?.some((p) => p?.id === id) ? true : false,
            })
            return typedAcc
        }, {})
    )
}
