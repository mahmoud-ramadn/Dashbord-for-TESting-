import { useParams } from "react-router"

import RoleForm from "@/components/forms/role"
import { useRole } from "@/hooks/roles"

export default function UpdateRole() {
    const { id } = useParams()

    const { value: role, loading } = useRole(id ?? "")

    return (
        <div className="container">
            <RoleForm values={role} isEdit loading={loading} />
        </div>
    )
}
