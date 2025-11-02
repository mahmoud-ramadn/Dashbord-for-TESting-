import { LEVELS, LEVELS_MAP } from "@/lib/constants"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import Module from "@/components/ui/module"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

type Props = {
    question: QuestionResponse | undefined
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function QuestionDetailsDialog({ question, open, onOpenChange }: Readonly<Props>) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:max-w-2xl">
                <DialogTitle>عرض السؤال</DialogTitle>
                <ScrollArea dir="rtl" className="max-h-[calc(90vh-5rem)] px-6 pb-6">
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <DialogTitle>السؤال</DialogTitle>
                            <DialogDescription>{question?.name}</DialogDescription>
                        </div>

                        <div className="space-y-2">
                            <DialogTitle>الإجابة</DialogTitle>
                            <DialogDescription>{question?.answer}</DialogDescription>
                        </div>

                        <div className="space-y-2">
                            <DialogTitle>الفئة</DialogTitle>
                            <DialogDescription>{question?.category?.arName}</DialogDescription>
                        </div>

                        <div className="space-y-2  ">
                            <DialogTitle>الصورة</DialogTitle>
                            {question?.photo ? (
                                <Module src={question?.photo} alt={question?.name} />
                            ) : (
                                <DialogDescription>لا يوجد صورة</DialogDescription>
                            )}
                        </div>

                        <div className="space-y-2 col-span-2">
                            <DialogTitle>المستوى</DialogTitle>
                            <DialogDescription>
                                {question?.level && question?.level !== ""
                                    ? LEVELS_MAP[question?.level as LEVELS]
                                    : "لا يوجد مستوى"}
                            </DialogDescription>
                        </div>
                    </div>

                    {/* ✅ Must be inside ScrollArea */}
                    <ScrollBar orientation="vertical" className="h-3 bg-gray-100 rounded-full" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
