import { useParams } from "react-router-dom"

import UserForm from "@/components/forms/user"
import { useUser } from "@/hooks/users"

export default function UpdateUser() {
    const { id } = useParams()

    const { value: user, loading } = useUser(id ?? "")

    return (
        <div className="container">
            <UserForm isEdit values={user} loading={loading} />
        </div>
    )
}
