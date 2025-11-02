import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { useState } from "react"

import type { QuestionReportStatus } from "@/lib/reports"

import { Button } from "@/components/ui/button"
import { SelectInput } from "@/components/ui/select-input"
import { Textarea } from "@/components/ui/textarea"

import { updateReportQuestionState } from "@/apis/reports"

type StatusOption = { label: string; value: QuestionReportStatus }

const STATUS_OPTIONS: StatusOption[] = [
    { label: "جديد", value: "NEW" as QuestionReportStatus },
    { label: "قيد المراجعة", value: "UNDER_REVIEW" as QuestionReportStatus },
    { label: "تم الحل", value: "RESOLVED" as QuestionReportStatus },
    { label: "مرفوض", value: "DISMISSED" as QuestionReportStatus },
]

const reportUpdateSchema = z
    .object({
        status: z.string().min(1, "يجب اختيار الحالة"),
        dismissedNote: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.status === "DISMISSED" && (!data.dismissedNote || data.dismissedNote.trim() === "")) {
                return false
            }
            return true
        },
        {
            message: "يجب إضافة ملاحظة عند رفض التقرير",
            path: ["dismissedNote"],
        }
    )

type ReportUpdateFormProps = {
    reportId: string
    onSuccess?: () => void
    onCancel?: () => void
    retry: () => void
}

export function ReportUpdateForm({ reportId, onSuccess, onCancel, retry }: ReportUpdateFormProps) {
    const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null)
    const [note, setNote] = useState("")
    const [error, setError] = useState("")

    const { mutate: updateReport, isPending } = useMutation({
        mutationFn: async ({ status, dismissedNote }: { status: QuestionReportStatus; dismissedNote?: string }) => {
            await updateReportQuestionState(reportId, { status, dismissedNote })
            await retry()
        },
        onSuccess: () => {
            toast.success("تم تغيير حالة التقرير بنجاح")
            setSelectedStatus(null)
            setNote("")
            setError("")
            onSuccess?.()
        },
        onError: () => {
            toast.error("فشل تغيير حالة التقرير")
        },
    })

    const handleSubmit = () => {
        const result = reportUpdateSchema.safeParse({
            status: selectedStatus?.value,
            dismissedNote: note.trim(),
        })

        if (!result.success) {
            const errorMessage = result.error.errors[0]?.message || "خطأ في التحقق من البيانات"
            setError(errorMessage)
            toast.error(errorMessage)
            return
        }

        setError("")

        if (selectedStatus) {
            updateReport({
                status: selectedStatus.value,
                dismissedNote: note.trim() || undefined,
            })
        }
    }

    return (
        <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">تغيير حالة التقرير</h4>
            <div className="space-y-3">
                <div className="flex-1">
                    <SelectInput
                        value={selectedStatus}
                        onChange={(value) => {
                            setSelectedStatus(value as StatusOption)
                            setError("")
                        }}
                        placeholder="اختر الحالة الجديدة"
                        options={STATUS_OPTIONS}
                        disabled={isPending}
                    />
                </div>
                <div className="flex-1">
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                        ملاحظات {selectedStatus?.value === "DISMISSED" ? "(مطلوب)" : "(اختياري)"}
                    </label>
                    <Textarea
                        value={note}
                        onChange={(e) => {
                            setNote(e.target.value)
                            setError("")
                        }}
                        placeholder="أضف ملاحظات حول التقرير..."
                        className={`min-h-[80px] resize-none ${error ? "border-red-500" : ""}`}
                        disabled={isPending}
                    />
                    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleSubmit} disabled={!selectedStatus || isPending} className="flex-1">
                        {isPending ? "جاري التحديث..." : "تحديث الحالة"}
                    </Button>
                    {onCancel && (
                        <Button onClick={onCancel} disabled={isPending} className="flex-1">
                            إلغاء
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
