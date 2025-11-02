import { useParams } from "react-router"

import TermsAndConditionsForm from "@/components/forms/terms-and-conditions"
import { useTermsAndConditionsById } from "@/hooks/terms-and-conditions"

export default function TermsAndConditionsUpdate() {
    const { id } = useParams()
    const { value: termsAndConditions, loading } = useTermsAndConditionsById(id ?? "")

    return (
        <div className="container">
            <TermsAndConditionsForm isEdit values={termsAndConditions} loading={loading} />
        </div>
    )
}
