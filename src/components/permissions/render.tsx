import type { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import { usePermissions } from "@/hooks/use-permissions"

type Props = {
    businessModule: PermissionsBusinessModule
    permissions: PermissionEnum[]
    children: React.ReactNode
}

export default function PermissionsRender({ businessModule, permissions, children }: Readonly<Props>) {
    const haveAccess = usePermissions(businessModule, permissions)

    if (!haveAccess) {
        return null
    }

    return <>{children}</>
}
