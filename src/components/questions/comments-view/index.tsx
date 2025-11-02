import { useMutation } from "@tanstack/react-query"
import { PencilIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import { useState } from "react"

import { formatDate } from "@/lib/map"

import { Button, ButtonWithLoading } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { deleteQuestionComment } from "@/apis/questions"
import QuestionAddEditCommentDialog from "@/components/questions/add-edit-comment-dialog"

type Props = {
    comments: QuestionCommentResponse[] | undefined
    open?: boolean
    setOpen?: (open: boolean) => void
    onEditCommentComplete?: (comment?: QuestionCommentResponse) => void
    onDeleteCommentComplete?: (comment?: QuestionCommentResponse) => void
}

export default function QuestionCommentsView({
    comments,
    open = false,
    setOpen,
    onEditCommentComplete,
    onDeleteCommentComplete,
}: Readonly<Props>) {
    const [comment, setComment] = useState<QuestionCommentResponse>()
    const [openEditComment, setOpenEditComment] = useState(false)
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)

    const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
        mutationFn: async (comment: QuestionCommentResponse) => {
            setDeletingCommentId(comment.id)
            await deleteQuestionComment(comment?.id)
            return comment
        },
        onSuccess: (comment) => {
            toast.success("تم حذف التعليق بنجاح")
            setDeletingCommentId(null)
            onDeleteCommentComplete?.(comment)
        },
        onError: () => {
            toast.error("حدث خطأ ما")
            setDeletingCommentId(null)
        },
    })

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>التعليقات</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-4">
                        {comments?.map((comment) => {
                            return (
                                <div key={comment?.id} className="flex flex-col md:flex-row items-center gap-x-2">
                                    <div className="flex flex-col gap-y-1 grow">
                                        <div className="flex items-center gap-x-2">
                                            <img
                                                src={comment?.createdByUser?.avatar}
                                                alt={comment?.createdByUser?.name}
                                                className="size-10 rounded-full border"
                                            />
                                            <p className="text-sm font-semibold">{comment?.createdByUser?.name}</p>
                                        </div>

                                        <div className="flex flex-col gap-y-1 text-gray-600">
                                            <p>{comment?.comment}</p>
                                            <p className="text-xs text-gray-400">{formatDate(comment?.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-x-2 shrink-0">
                                        <Button
                                            variant="outline"
                                            className="rounded-full"
                                            size="icon"
                                            onClick={() => {
                                                setComment(comment)
                                                setOpenEditComment(true)
                                            }}
                                        >
                                            <PencilIcon className="size-4.5" />
                                        </Button>

                                        <ButtonWithLoading
                                            variant="destructive"
                                            className="rounded-full"
                                            size="icon"
                                            loading={isDeletingComment && deletingCommentId === comment.id}
                                            onClick={() => {
                                                deleteComment(comment)
                                            }}
                                        >
                                            <TrashIcon className="size-4.5" />
                                        </ButtonWithLoading>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </DialogContent>
            </Dialog>

            <QuestionAddEditCommentDialog
                comment={comment}
                open={openEditComment}
                setOpen={setOpenEditComment}
                onComplete={(value) => {
                    setOpenEditComment(false)
                    onEditCommentComplete?.(value)
                }}
                isEdit
            />
        </>
    )
}
