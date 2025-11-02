import { useAtomValue } from "jotai"

import { Navigate, Outlet } from "react-router-dom"

import { userAtom } from "@/atoms"

export default function AuthGuard() {
    const user = useAtomValue(userAtom)
    if (user) {
        return <Navigate to="/" replace />
    }
    return <Outlet />
}
