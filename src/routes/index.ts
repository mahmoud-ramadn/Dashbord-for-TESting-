import { lazy } from "react"
import { createBrowserRouter } from "react-router"

import ProtectedRoute from "@/components/protected-route"
import Layout from "@/layouts"
import { AuthRoutes } from "@/routes/auth"
import { DashboardRoutes } from "@/routes/dashboard"

const NotFound = lazy(() => import("@/pages/not-found"))
const UIComponents = lazy(() => import("@/pages/ui-components"))

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            {
                path: "",
                Component: ProtectedRoute,
                children: [DashboardRoutes],
            },
            {
                path: "ui-components",
                Component: UIComponents,
            },
            AuthRoutes,
            {
                path: "*",
                Component: NotFound,
            },
        ],
    },
])
