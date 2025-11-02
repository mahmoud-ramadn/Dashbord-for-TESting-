import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useForm } from "react-hook-form"

import { ButtonWithLoading } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormLoading, FormMessage } from "@/components/ui/form"
import { Form } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { createQuestionComment, updateQuestionComment } from "@/apis/questions"
import { type CommentFormSchema, commentFormSchema } from "@/components/forms/comment/schema"

type Props = {
    isEdit?: boolean
    values?: QuestionCommentResponse | null
    question?: QuestionResponse
    loading?: boolean
    onComplete?: (value?: QuestionCommentResponse) => void
}

export default function CommentForm({ isEdit = false, values, question, loading = false, onComplete }: Props) {
    const form = useForm<CommentFormSchema>({
        resolver: zodResolver(commentFormSchema),
        values: {
            comment: values?.comment ?? "",
        },
    })

    async function onSubmit(inputs: CommentFormSchema) {
        try {
            let response

            if (isEdit && values?.id) {
                response = await updateQuestionComment(values?.id, inputs)
            }

            if (!isEdit && question?.id) {
                response = await createQuestionComment(question?.id, inputs)
            }

            toast.success(response?.message)

            onComplete?.(response?.data)
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    const title = (isEdit ? "تعديل" : "إنشاء") + " تعليق"

    return (
        <div>
            <Form {...form}>
                <FormLoading loading={loading}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>التعليق</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="التعليق" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ButtonWithLoading
                            type="submit"
                            size="lg"
                            className="mt-6"
                            loading={form?.formState?.isSubmitting}
                        >
                            {title}
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
