import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useForm } from "react-hook-form"

import { ButtonWithLoading } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormLoading, FormMessage } from "@/components/ui/form"
import { Form } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { UpdateGameInfo } from "@/apis/game-info"

import { GameInfoFormSchema, type GameInfoFormSchemaType } from "./schema"

type Props = {
    values?: GameINfoInputs
    loading?: boolean
    retry: () => void
    closeDialog: () => void
}

export default function GameInfoForm({ values, loading = false, retry, closeDialog }: Props) {
    const form = useForm<GameInfoFormSchemaType>({
        resolver: zodResolver(GameInfoFormSchema),
        defaultValues: {
            brief: values?.brief,
        },
    })

    async function onSubmit(inputs: GameInfoFormSchemaType) {
        try {
            if (!values?.brief) {
                toast.error("لا يمكن تعديل الوصف لأن البيانات غير متوفرة بعد.")
                return
            }

            await UpdateGameInfo(inputs)
            toast.success("تم تعديل الوصف بنجاح")
            retry()
            closeDialog()
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message ?? "حدث خطأ غير متوقع")
        }
    }

    return (
        <Form {...form}>
            <FormLoading loading={loading}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
                    <FormField
                        control={form.control}
                        name="brief"
                        render={({ field }) => (
                            <FormItem className="col-span-full">
                                <FormLabel>وصف اللعبة</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="وصف اللعبة" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <ButtonWithLoading type="submit" size="lg" className="mt-6" loading={form.formState.isSubmitting}>
                        تعديل
                    </ButtonWithLoading>
                </form>
            </FormLoading>
        </Form>
    )
}
