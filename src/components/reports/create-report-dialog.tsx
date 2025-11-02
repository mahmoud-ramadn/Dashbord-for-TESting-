import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { QuestionReportReason, QuestionReportStatus } from "@/lib/reports"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SelectInput } from "@/components/ui/select-input"
import { Textarea } from "@/components/ui/textarea"

import { createReportQuestion } from "@/apis/reports"

type ReportReason = { label: string; value: QuestionReportReason }

const REPORT_REASONS: ReportReason[] = [
    {
        label: "الإجابة الصحيحة غير صحيحة",
        value: QuestionReportReason.THE_CORRECT_ANSWER_IS_WRONG,
    },
    {
        label: "السؤال يحتوي على أكثر من إجابة صحيحة",
        value: QuestionReportReason.MULTIPLE_CORRECT_ANSWERS,
    },
    {
        label: "السؤال غير واضح أو مربك",
        value: QuestionReportReason.QUESTION_UNCLEAR_OR_CONFUSING,
    },
    {
        label: "خطأ إملائي أو نحوي في السؤال",
        value: QuestionReportReason.SPELLING_OR_GRAMMAR_ERROR,
    },
    {
        label: "معلومة قديمة أو غير محدثة",
        value: QuestionReportReason.OUTDATED_INFORMATION,
    },
    {
        label: "أخرى",
        value: QuestionReportReason.OTHER,
    },
]

const createReportSchema = z.object({
    reason: z.string().min(1, "يجب اختيار سبب الإبلاغ"),
    details: z.string().min(1, "يجب إضافة وصف للمشكلة"),
    selectedAnswer: z.string().max(200, "يجب أن لا تتجاوز الإجابة 200 حرف").optional(),
})

type CreateReportFormValues = z.infer<typeof createReportSchema>

type Props = {
    question?: QuestionResponse
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export default function CreateReportDialog({ question, open, onOpenChange, onSuccess }: Readonly<Props>) {
    const form = useForm<CreateReportFormValues>({
        resolver: zodResolver(createReportSchema),
        defaultValues: {
            reason: "",
            details: "",
            selectedAnswer: "",
        },
    })

    const { mutate: createReport, isPending } = useMutation({
        mutationFn: async (data: CreateReportFormValues) => {
            if (!question?.id) throw new Error("Question ID is required")

            await createReportQuestion(question.id, {
                reason: data.reason as QuestionReportStatus,
                details: data.details?.trim(),
                selectedAnswer: data.selectedAnswer?.trim() || undefined,
            })
        },
        onSuccess: () => {
            toast.success("!شكرًا لمساعدتك في تحسين اللعبة")
            form.reset()
            onSuccess?.()
        },
        onError: (error) => {
            toast.error(error?.message || "فشل إرسال الإبلاغ")
        },
    })

    const onSubmit = (data: CreateReportFormValues) => {
        createReport(data)
    }

    const handleClose = (open: boolean) => {
        if (!open && !isPending) {
            form.reset()
        }
        onOpenChange(open)
    }

    useEffect(() => {
        if (open) {
            form.reset()
        }
    }, [open, form])

    const detailsValue = form.watch("details") || ""
    const selectedAnswerValue = form.watch("selectedAnswer") || ""

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="lg:max-w-2xl">
                <DialogTitle>الإبلاغ عن إجابة خاطئة</DialogTitle>

                <div className="space-y-4 mt-4">
                    {/* Question Info */}
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">السؤال</h4>
                        <p className="text-sm">{question?.name || "لا يوجد"}</p>

                        <h4 className="text-sm font-medium text-muted-foreground mt-2">الإجابة الحالية</h4>
                        <p className="text-sm">{question?.answer || "لا يوجد"}</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            سبب الإبلاغ <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <SelectInput
                                                value={
                                                    field.value
                                                        ? REPORT_REASONS.find((r) => r.value === field.value)
                                                        : null
                                                }
                                                onChange={(value) => {
                                                    const reason = value as ReportReason
                                                    field.onChange(reason?.value || "")
                                                }}
                                                placeholder="اختر سبب الإبلاغ"
                                                options={REPORT_REASONS}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="selectedAnswer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الإجابة الصحيحة (اختياري)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="إذا كانت الإجابة خاطئة، أدخل الإجابة الصحيحة هنا..."
                                                className="min-h-[60px] resize-none"
                                                disabled={isPending}
                                                maxLength={200}
                                            />
                                        </FormControl>
                                        <div className="flex justify-between items-center">
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground ml-auto">
                                                {selectedAnswerValue.length} / 200
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="details"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            وصف المشكلة <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="اشرح المشكلة بالتفصيل... (10-500 حرف)"
                                                className="min-h-[100px] resize-none"
                                                disabled={isPending}
                                                maxLength={500}
                                            />
                                        </FormControl>
                                        <div className="flex justify-between items-center">
                                            <FormMessage />
                                            <p
                                                className={`text-xs ml-auto ${
                                                    detailsValue.length < 10
                                                        ? "text-orange-500"
                                                        : "text-muted-foreground"
                                                }`}
                                            >
                                                {detailsValue.length} / 500
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={isPending} className="flex-1">
                                    {isPending ? "جاري الإرسال..." : "إرسال الإبلاغ"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleClose(false)}
                                    variant="outline"
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
