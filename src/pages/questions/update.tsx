import { useParams } from "react-router"

import QuestionForm from "@/components/forms/Question"
import { useQuestion } from "@/hooks/questions"

export default function UpdateQuestion() {
    const { id } = useParams()
    const { value: question, loading } = useQuestion(id ?? "")

    return (
        <div className="container">
            <QuestionForm isEdit values={question} loading={loading} />
        </div>
    )
}
