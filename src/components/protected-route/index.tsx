import { useAtomValue } from "jotai"
import { flatMap } from "lodash-es"

import { Navigate, Outlet, useMatches } from "react-router-dom"

import { PermissionEnum, type PermissionsBusinessModule, PermissionsBusinessModuleRoute } from "@/lib/permissions"

import { userAtom } from "@/atoms"
import { usePermissions } from "@/hooks/use-permissions"

export default function ProtectedRoute() {
    const user = useAtomValue(userAtom)
    const matches = useMatches()

    const allUserPermissions = flatMap(user?.roles, (role) => role?.permissions || []).sort((a, b) => {
        if (a.permission === "VIEW" && b.permission !== "VIEW") return -1
        if (a.permission !== "VIEW" && b.permission === "VIEW") return 1
        return 0
    })

    const currentRouteMatch = matches[matches.length - 1]
    const currentRouteHandle = currentRouteMatch?.handle as {
        businessModule: PermissionsBusinessModule
        permission: PermissionEnum
    }

    const haveAccess = usePermissions(currentRouteHandle?.businessModule, [currentRouteHandle?.permission])

    if (!user) {
        return <Navigate to="/login" />
    }

    if (!haveAccess) {
        const firstPermission = allUserPermissions[0]

        const frontRoute =
            PermissionsBusinessModuleRoute[
                firstPermission?.businessModule as keyof typeof PermissionsBusinessModuleRoute
            ]

        const tail =
            firstPermission?.permission !== PermissionEnum.VIEW
                ? `/${PermissionEnum[firstPermission?.permission as keyof typeof PermissionEnum].toLowerCase()}`
                : ""

        const combinedRoute = `${frontRoute}${tail}`

        const currentRoute =
            firstPermission?.permission === PermissionEnum.UPDATE ||
            firstPermission?.permission === PermissionEnum.DELETE
                ? "/not-found"
                : combinedRoute

        return <Navigate to={currentRoute} />
    }

    return <Outlet />
}
