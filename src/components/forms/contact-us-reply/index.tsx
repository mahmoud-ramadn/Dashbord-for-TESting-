import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useForm } from "react-hook-form"

import { ButtonWithLoading } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormLoading, FormMessage } from "@/components/ui/form"
import { Form } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { createReply } from "@/apis/contact-us"

import { type ReplayFormSchema, replayFormSchema } from "./shecma"

type Props = {
    loading?: boolean
    message: ContactUsResponse | null
    closeDialog: (value: boolean) => void
}

export default function ReplayForm({ loading = false, message, closeDialog }: Props) {
    const form = useForm<ReplayFormSchema>({
        resolver: zodResolver(replayFormSchema),
        values: {
            reply: "",
        },
    })

    async function onSubmit(inputs: ReplayFormSchema) {
        try {
            await createReply(message?.id ?? "", inputs)
            toast.success("تم إرسال الرد بنجاح")
            closeDialog(false)
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    return (
        <div>
            <Form {...form}>
                <FormLoading loading={loading}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
                        <FormField
                            control={form.control}
                            name="reply"
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>الرد</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="الرد على الرسالة" {...field} />
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
                            ارسال
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
