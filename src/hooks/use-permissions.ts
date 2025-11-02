import { useAtomValue } from "jotai"
import { flatMap, some } from "lodash-es"

import { useMemo } from "react"

import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import { userAtom } from "@/atoms"

// Cache to store computed results
const permissionCache = new Map<string, boolean>()

// Helper function to create a cache key
const createCacheKey = (
    businessModule: PermissionsBusinessModule,
    permissions: PermissionEnum[],
    userId: string,
    userRolesHash: string
): string => {
    return `${businessModule}-${permissions.sort().join(",")}-${userId}-${userRolesHash}`
}

// Helper function to create a hash of user roles and permissions
const createUserRolesHash = (user: UserResponse): string => {
    if (!user?.roles) return "no-roles"

    const rolesData = user.roles
        .map((role) => ({
            id: role.id,
            permissions: role.permissions?.map((p) => `${p.businessModule}:${p.permission}`).sort() || [],
        }))
        .sort((a, b) => a.id.localeCompare(b.id))
    return JSON.stringify(rolesData)
}

export const isHasAccess = (
    businessModule: PermissionsBusinessModule,
    permissions: PermissionEnum[],
    user: UserResponse
) => {
    // Create cache key
    const userRolesHash = createUserRolesHash(user)
    const cacheKey = createCacheKey(businessModule, permissions, user?.id || "no-user", userRolesHash)

    // Check cache first
    if (permissionCache.has(cacheKey)) {
        return permissionCache.get(cacheKey)!
    }

    const allUserPermissions = flatMap(user?.roles, (role) => role?.permissions || [])

    const haveAccess =
        some(
            allUserPermissions,
            (permission) =>
                permission?.businessModule === businessModule &&
                permissions?.includes(permission?.permission as PermissionEnum)
        ) ||
        allUserPermissions.some(
            (permission) =>
                permission?.businessModule === PermissionsBusinessModule.ALL &&
                permissions?.includes(permission?.permission as PermissionEnum)
        )

    // Store result in cache
    permissionCache.set(cacheKey, haveAccess)

    // Optional: Limit cache size to prevent memory leaks
    if (permissionCache.size > 500) {
        const firstKey = permissionCache.keys().next().value
        if (firstKey) {
            permissionCache.delete(firstKey)
        }
    }

    return haveAccess
}

// Function to clear the permission cache
export const clearPermissionCache = (): void => {
    permissionCache.clear()
}

// Function to clear cache for a specific user
export const clearUserPermissionCache = (userId: string): void => {
    const keysToDelete = Array.from(permissionCache.keys()).filter((key) => key.includes(userId))
    keysToDelete.forEach((key) => permissionCache.delete(key))
}

export const usePermissions = (businessModule: PermissionsBusinessModule, permissions: PermissionEnum[]) => {
    const user = useAtomValue(userAtom)

    const haveAccess = useMemo<boolean>(() => {
        return isHasAccess(businessModule, permissions, user as UserResponse) || false
    }, [businessModule, permissions, user])

    if (!businessModule || !permissions?.length) {
        return true
    }

    return haveAccess
}
