import { lazy } from "react"
import { Outlet } from "react-router"

import { SidebarProvider } from "@/components/ui/sidebar"

import DashboardSidebar from "@/components/dashboard-sidebar"

const Header = lazy(() => import("@/components/header"))

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main className="grow">
                <Header />
                <div className="h-10" />
                <Outlet />
            </main>
        </SidebarProvider>
    )
}
