import { useParams } from "react-router"

import GroupForm from "@/components/forms/group"
import { useGroup } from "@/hooks/groups"

export default function UpdateGroup() {
    const { id } = useParams()

    const { value: group, loading } = useGroup(id ?? "")

    return (
        <div className="container">
            <GroupForm isEdit values={group} loading={loading} />
        </div>
    )
}
