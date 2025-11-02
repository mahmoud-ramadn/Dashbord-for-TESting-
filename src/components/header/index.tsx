import { useSetAtom } from "jotai"
import { LogOut } from "lucide-react"

import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { tokenAtom, userAtom } from "@/atoms"

import Notification from "../notification/notification"

export default function Header() {
    const navigate = useNavigate()
    const setUser = useSetAtom(userAtom)
    const setToken = useSetAtom(tokenAtom)

    const handleLogout = () => {
        setUser(null)
        setToken(null)
        navigate("/login")
    }

    return (
        <header className="p-6 bg-primary flex items-center justify-between">
            <SidebarTrigger />

            <div className="flex items-center gap-4">
                <Notification />
                <Button
                    variant="destructive"
                    size="icon"
                    className="size-11 rounded-full shadow-lg hover:scale-105 transition-transform"
                    onClick={handleLogout}
                    title="تسجيل الخروج"
                >
                    <LogOut className="size-5" />
                </Button>
            </div>
        </header>
    )
}
