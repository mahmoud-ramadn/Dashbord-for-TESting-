import { useParams } from "react-router"

import PoliciesForm from "@/components/forms/policies"
import { usePoliciesById } from "@/hooks/policies"

export default function PoliciesUpdate() {
    const { id } = useParams()
    const { value: policies, loading } = usePoliciesById(id ?? "")

    return (
        <div className="container">
            <PoliciesForm isEdit values={policies} loading={loading} />
        </div>
    )
}
