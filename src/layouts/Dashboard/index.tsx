import { onMessage } from "firebase/messaging";
import { toast } from "sonner";



import { lazy, useEffect } from "react";
import { Outlet } from "react-router";



import { SidebarProvider } from "@/components/ui/sidebar";



import DashboardSidebar from "@/components/dashboard-sidebar";
import { generateToken, messaging } from "@/notifications/firebase";





const Header = lazy(() => import("@/components/header"))

export default function DashboardLayout() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("✅ Service Worker registered:", registration)
                })
                .catch((err) => {
                    console.error("❌ Service Worker registration failed:", err)
                })
        }
    }, [])

    useEffect(() => {
        generateToken()
        onMessage(messaging, (payload) => {
            toast.success(`ا شعار جديد: ${payload.notification?.title} ****** ${payload.notification?.body}`)
        })
    }, [])
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