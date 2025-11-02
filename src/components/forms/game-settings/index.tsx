import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useForm } from "react-hook-form"

import { ButtonWithLoading } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormLoading, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { updateGameSettings } from "@/apis/game-settings"

import { GameSettingFormSchema, type GameSettingFormSchemaType } from "./schema"

type Props = {
    values?: GameSettingsInput
    closeDialog: () => void
    loading?: boolean
    retry: () => void
}

export default function GameSettingsForm({ values, loading = false, retry, closeDialog }: Props) {
    const form = useForm<GameSettingFormSchemaType>({
        resolver: zodResolver(GameSettingFormSchema),
        defaultValues: {
            easyPoints: values?.easyPoints ?? 0,
            mediumPoints: values?.mediumPoints ?? 0,
            hardPoints: values?.hardPoints ?? 0,
            timeExtensionSeconds: values?.timeExtensionSeconds ?? 0,
            timePerQuestionSeconds: values?.timePerQuestionSeconds ?? 0,
        },
    })

    async function onSubmit(inputs: GameSettingFormSchemaType) {
        try {
            if (!values) {
                toast.error("لا يمكن تعديل إعدادات اللعبة لأن البيانات غير متوفرة بعد.")
                return
            }

            await updateGameSettings(inputs)
            toast.success("تم تحديث إعدادات اللعبة بنجاح ")
            retry()
            closeDialog()
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message ?? "حدث خطأ أثناء تحديث إعدادات اللعبة ⚠️")
        }
    }

    return (
        <div>
            <Form {...form}>
                <FormLoading loading={loading}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-6 space-y-4 grid gap-10 md:grid-cols-2 grid-cols-1 "
                    >
                        {/* باقي الفورم كما هو */}
                        <FormField
                            control={form.control}
                            name="easyPoints"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نقاط المستوى السهل</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="نقاط المستوى السهل"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="mediumPoints"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نقاط المستوى المتوسط</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="نقاط المستوى المتوسط"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hardPoints"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نقاط المستوى الصعب</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="نقاط المستوى الصعب"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="timePerQuestionSeconds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>الوقت لكل سؤال (بالثواني)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="الوقت لكل سؤال"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="timeExtensionSeconds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>وقت التمديد (بالثواني)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="وقت التمديد"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ButtonWithLoading
                            type="submit"
                            size="lg"
                            className="mt-6 w-full"
                            loading={form.formState.isSubmitting}
                        >
                            حفظ الإعدادات
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
