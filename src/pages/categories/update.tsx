import { useParams } from "react-router-dom"

import CategoryForm from "@/components/forms/category"
import { useCategory } from "@/hooks/categories"

export default function UpdateCategory() {
    const { id } = useParams()
    const { value: category, loading } = useCategory(id ?? "")

    return (
        <div className="container">
            <CategoryForm isEdit values={category} loading={loading} />
        </div>
    )
}
