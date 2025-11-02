import { lazy } from "react"
import type { RouteObject } from "react-router"

import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

const Home = lazy(() => import("@/pages/index.tsx"))
const DashboardLayout = lazy(() => import("@/layouts/Dashboard"))
const packages = lazy(() => import("@/pages/packages"))
const CreatePackages = lazy(() => import("@/pages/packages/create"))
const UpdatePackages = lazy(() => import("@/pages/packages/update"))
const Groups = lazy(() => import("@/pages/groups"))
const CreateGroup = lazy(() => import("@/pages/groups/create"))
const UpdateGroup = lazy(() => import("@/pages/groups/update"))
const Categories = lazy(() => import("@/pages/categories"))
const CreateCategory = lazy(() => import("@/pages/categories/create"))
const UpdateCategory = lazy(() => import("@/pages/categories/update"))
const Questions = lazy(() => import("@/pages/questions"))
const CreateQuestion = lazy(() => import("@/pages/questions/create"))
const UpdateQuestion = lazy(() => import("@/pages/questions/update"))
const ViewCategory = lazy(() => import("@/pages/categories/view"))
const Roles = lazy(() => import("@/pages/roles"))
const CreateRole = lazy(() => import("@/pages/roles/create"))
const UpdateRole = lazy(() => import("@/pages/roles/update"))
const Users = lazy(() => import("@/pages/users"))
const CreateUser = lazy(() => import("@/pages/users/create"))
const UpdateUser = lazy(() => import("@/pages/users/update"))
const ContactUs = lazy(() => import("@/pages/contact-us"))
const GameInfo = lazy(() => import("@/pages/game-info"))
const GameSettings = lazy(() => import("@/pages/game-settings"))
const Reports = lazy(() => import("@/pages/reports"))

const packagesAnalytics = lazy(() => import("@/pages/package-analytics"))
const TermsAndConditions = lazy(() => import("@/pages/terms-and-conditions"))
const TermsAndConditionsCreate = lazy(() => import("@/pages/terms-and-conditions/create"))
const TermsAndConditionsUpdate = lazy(() => import("@/pages/terms-and-conditions/update"))

const Policies = lazy(() => import("@/pages/policies"))
const PoliciesCreate = lazy(() => import("@/pages/policies/create"))
const PoliciesUpdate = lazy(() => import("@/pages/policies/update"))

export const DashboardRoutes: RouteObject = {
    path: "",
    Component: DashboardLayout,
    children: [
        {
            path: "",
            index: true,
            Component: Home,
            handle: { businessModule: PermissionsBusinessModule.DASHBOARD, permission: PermissionEnum.VIEW },
        },
        {
            path: "packages",
            children: [
                {
                    path: "",
                    Component: packages,
                },
                {
                    path: "create",
                    Component: CreatePackages,
                    handle: {
                        businessModule: PermissionsBusinessModule.GAME_PACKAGES,
                        permission: PermissionEnum.CREATE,
                    },
                },
                {
                    path: "update/:id",
                    Component: UpdatePackages,
                    handle: {
                        businessModule: PermissionsBusinessModule.GAME_PACKAGES,
                        permission: PermissionEnum.CREATE,
                    },
                },
            ],
        },
        {
            path: "groups",
            children: [
                {
                    path: "",
                    Component: Groups,
                },
                {
                    path: "create",
                    Component: CreateGroup,
                    handle: { businessModule: PermissionsBusinessModule.GROUPS, permission: PermissionEnum.CREATE },
                },
                {
                    path: "update/:id",
                    Component: UpdateGroup,
                    handle: { businessModule: PermissionsBusinessModule.GROUPS, permission: PermissionEnum.UPDATE },
                },
            ],
        },
        {
            path: "categories",
            children: [
                {
                    path: "",
                    Component: Categories,
                    handle: { businessModule: PermissionsBusinessModule.CATEGORIES, permission: PermissionEnum.VIEW },
                },
                {
                    path: "create",
                    Component: CreateCategory,
                    handle: { businessModule: PermissionsBusinessModule.CATEGORIES, permission: PermissionEnum.CREATE },
                },
                {
                    path: ":id",
                    Component: ViewCategory,
                    handle: { businessModule: PermissionsBusinessModule.CATEGORIES, permission: PermissionEnum.VIEW },
                },
                {
                    path: "update/:id",
                    Component: UpdateCategory,
                    handle: { businessModule: PermissionsBusinessModule.CATEGORIES, permission: PermissionEnum.UPDATE },
                },
            ],
        },
        {
            path: "roles",
            children: [
                {
                    path: "",
                    Component: Roles,
                    handle: { businessModule: PermissionsBusinessModule.ROLES, permission: PermissionEnum.VIEW },
                },
                {
                    path: "create",
                    Component: CreateRole,
                    handle: { businessModule: PermissionsBusinessModule.ROLES, permission: PermissionEnum.CREATE },
                },
                {
                    path: "update/:id",
                    Component: UpdateRole,
                    handle: { businessModule: PermissionsBusinessModule.ROLES, permission: PermissionEnum.UPDATE },
                },
            ],
        },
        {
            path: "users",
            children: [
                {
                    path: "",
                    Component: Users,
                    handle: { businessModule: PermissionsBusinessModule.USERS, permission: PermissionEnum.VIEW },
                },
                {
                    path: "create",
                    Component: CreateUser,
                    handle: { businessModule: PermissionsBusinessModule.USERS, permission: PermissionEnum.CREATE },
                },
                {
                    path: "update/:id",
                    Component: UpdateUser,
                    handle: { businessModule: PermissionsBusinessModule.USERS, permission: PermissionEnum.UPDATE },
                },
            ],
        },
        {
            path: "questions",
            children: [
                {
                    path: "",
                    Component: Questions,
                    handle: { businessModule: PermissionsBusinessModule.QUESTIONS, permission: PermissionEnum.VIEW },
                },
                {
                    path: "update/:id/:categoryId?/:categoryName?",
                    Component: UpdateQuestion,
                    handle: { businessModule: PermissionsBusinessModule.QUESTIONS, permission: PermissionEnum.UPDATE },
                },
                {
                    path: "create/:categoryId?/:categoryName?",
                    Component: CreateQuestion,
                    handle: { businessModule: PermissionsBusinessModule.QUESTIONS, permission: PermissionEnum.CREATE },
                },
            ],
        },
        {
            path: "contact-us",
            children: [
                {
                    path: "",
                    Component: ContactUs,
                    handle: { businessModule: PermissionsBusinessModule.CONTACT_US, permission: PermissionEnum.VIEW },
                },
            ],
        },
        {
            path: "terms-and-conditions",
            children: [
                {
                    path: "",
                    Component: TermsAndConditions,
                    handle: {
                        businessModule: PermissionsBusinessModule.SETTINGS,
                        permission: PermissionEnum.VIEW,
                    },
                },
                {
                    path: "create",
                    Component: TermsAndConditionsCreate,
                    handle: {
                        businessModule: PermissionsBusinessModule.SETTINGS,
                        permission: PermissionEnum.CREATE,
                    },
                },
                {
                    path: "update/:id",
                    Component: TermsAndConditionsUpdate,
                    handle: {
                        businessModule: PermissionsBusinessModule.SETTINGS,
                        permission: PermissionEnum.UPDATE,
                    },
                },
            ],
        },
        {
            path: "policies",
            children: [
                {
                    path: "",
                    Component: Policies,
                    handle: {
                        businessModule: PermissionsBusinessModule.SETTINGS,
                        permission: PermissionEnum.VIEW,
                    },
                },
                {
                    path: "create",
                    Component: PoliciesCreate,
                    handle: {
                        businessModule: PermissionsBusinessModule.SETTINGS,
                        permission: PermissionEnum.CREATE,
                    },
                },
                {
                    path: "update/:id",
                    Component: PoliciesUpdate,
                    handle: {
                        businessModule: PermissionsBusinessModule.SETTINGS,
                        permission: PermissionEnum.UPDATE,
                    },
                },
            ],
        },
        {
            path: "reports",
            Component: Reports,
            handle: {
                businessModule: PermissionsBusinessModule.REPORTS,
                permission: PermissionEnum.VIEW,
            },
        },
        {
            path: "game-info",
            Component: GameInfo,
        },
        {
            path: "game-settings",
            Component: GameSettings,
        },
        {
            path: "packages-analytics",
            Component: packagesAnalytics,
        },
    ],
}
