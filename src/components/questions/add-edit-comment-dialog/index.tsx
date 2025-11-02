import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import CommentForm from "@/components/forms/comment"

type Props = {
    question?: QuestionResponse
    comment?: QuestionCommentResponse
    open: boolean
    setOpen: (open: boolean) => void
    isEdit?: boolean
    onComplete?: (value?: QuestionCommentResponse) => void
}

export default function QuestionAddEditCommentDialog({
    question,
    comment,
    open,
    setOpen,
    isEdit = false,
    onComplete,
}: Readonly<Props>) {
    const title = (isEdit ? "تعديل" : "إضافة") + " تعليق"

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <CommentForm question={question} isEdit={isEdit} onComplete={onComplete} values={comment} />
            </DialogContent>
        </Dialog>
    )
}
