import { useParams } from "react-router"

import PackagesForm from "@/components/forms/packages"
import { usePackage } from "@/hooks/packages"

export default function UpdatePackages() {
    const { id } = useParams()
    const { value: packageData, loading } = usePackage(id ?? "")
    return (
        <div className="container">
            <PackagesForm isEdit values={packageData} loading={loading} />
        </div>
    )
}
