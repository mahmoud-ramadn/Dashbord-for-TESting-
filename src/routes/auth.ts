import { lazy } from "react"
import type { RouteObject } from "react-router"

import AuthGuard from "@/components/auth-guard"

const AuthLayout = lazy(() => import("@/layouts/Auth"))
const Login = lazy(() => import("@/pages/login.tsx"))

export const AuthRoutes: RouteObject = {
    path: "",
    Component: AuthLayout,
    children: [
        {
            path: "login",
            Component: AuthGuard,
            children: [{ path: "", Component: Login }],
        },
    ],
}
