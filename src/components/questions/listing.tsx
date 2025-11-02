/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { MessageSquareMoreIcon, MessageSquareOffIcon, MoreVerticalIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { useMemo, useState } from "react"
import { useListener } from "react-bus"
import { Link } from "react-router-dom"

import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Module from "@/components/ui/module"
import { Switch } from "@/components/ui/switch"

import { deleteQuestion as deleteQuestionApi, updateQuestion } from "@/apis/questions"
import PermissionsRender from "@/components/permissions/render"
import QuestionAddEditCommentDialog from "@/components/questions/add-edit-comment-dialog"
import QuestionCommentsView from "@/components/questions/comments-view"
import QuestionsFilter from "@/components/questions/filter"
import QuestionDetailsDialog from "@/components/questions/question-details-dialog"
import { useQuestions } from "@/hooks/questions"
import { useReports } from "@/hooks/reports"

import CreateReportDialog from "../reports/create-report-dialog"
import AppAlertDialog from "../ui/app-alert-dialog"

type Props = {
    className?: string
    category?: CategoryResponse | null
}

export default function QuestionsListing({ className, category }: Readonly<Props>) {
    const [open, setOpen] = useState(false)
    const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [questionForDetails, setQuestionForDetails] = useState<QuestionResponse>()
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [question, setQuestion] = useState<QuestionResponse>()
    const [reportDialogOpen, setReportDialogOpen] = useState(false)

    const categoryId = category?.id
    const categoryName = category?.arName
    const hasCategoryId = Boolean(categoryId)

    const {
        value: questions,
        loading: isLoading,
        retry,
    } = useQuestions({
        ...(hasCategoryId && { categoryId }),
    })
    const { value: reports } = useReports()

    /**
     *
     *
     *
     * Listen to the upload-questions-complete event and retry the questions query
     */
    useListener("upload-questions-complete", () => {
        retry()
    })
    const { mutate: deleteQuestion, isPending: isDeleting } = useMutation({
        mutationFn: async (id: string) => {
            await deleteQuestionApi(id)
        },
        onSuccess: () => {
            toast.success("تم حذف السؤال بنجاح")
            retry()
        },
        onError: () => {
            toast.error("فشل حذف السؤال")
        },
    })

    const { mutate: updateQuestionStatus } = useMutation({
        mutationFn: async ({ questionId, state }: { questionId: string; state: QuestionStatus }) => {
            await updateQuestion(questionId, { state })
            await retry()
        },
        onSuccess: () => {
            toast.success("تم تغيير حالة السؤال بنجاح")
        },
        onError: () => {
            toast.error("فشل تغيير حالة السؤال")
        },
    })

    const createQuestionLink = hasCategoryId ? `/questions/create/${categoryId}/${categoryName}` : "/questions/create"

    const columns: ColumnDef<QuestionResponse>[] = useMemo(
        () => [
            {
                accessorKey: "number",
                header: "# الرقم",
                cell: ({ row }) => {
                    return <span>{row.index + 1}</span>
                },
            },
            {
                accessorKey: "photo",
                cell: ({ row }) => {
                    const question = row?.original

                    if (!question?.photo) return <span className="text-gray-400">لا يوجد</span>

                    return <Module src={question.photo} alt={question.name || "صورة السؤال"} />
                },
                header: "صورة السؤال",
                id: "photo",
            },
            {
                accessorKey: "name",
                cell: ({ row }) => {
                    const question = row?.original

                    if (!question?.name) return <span className="text-gray-400">لا يوجد</span>

                    return <p>{question?.name}</p>
                },
                header: "السؤال",
            },
            {
                accessorKey: "answerPhoto",
                cell: ({ row }) => {
                    const question = row?.original

                    if (!question?.answerPhoto) return <span className="text-gray-400">لا يوجد</span>

                    return <Module src={question.answerPhoto} alt={question.answer || "صورة الإجابة"} />
                },
                header: "صورة الإجابة",
                id: "answer-photo",
            },
            {
                accessorKey: "answer",
                cell: ({ row }) => {
                    const question = row?.original

                    if (!question?.answer) return <span className="text-gray-400">لا يوجد</span>

                    return <p>{question?.answer}</p>
                },
                header: "الإجابة",
            },
            {
                accessorKey: "category.arName",
                header: "الفئة",
            },
            {
                accessorKey: "level",
                header: "المستوى",
            },
            {
                accessorKey: "comments",
                header: "التعليقات",
                cell: ({ row }) => {
                    const question = row?.original

                    const CommentIcon = question?.questionComments?.length
                        ? MessageSquareMoreIcon
                        : MessageSquareOffIcon

                    return (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                if (!question?.questionComments?.length) return

                                setCommentsOpen(true)
                                setQuestion(question)
                            }}
                        >
                            <CommentIcon
                                className={cn(
                                    "size-6 text-gray-400",
                                    question?.questionComments?.length && "text-primary"
                                )}
                            />
                        </Button>
                    )
                },
            },
            {
                accessorKey: "state",
                header: "الحالة",
                cell: ({ row }) => {
                    const question = row?.original

                    return (
                        <Switch
                            className="w-12 h-7"
                            defaultChecked={question?.state === "ACTIVE"}
                            onCheckedChange={(value) => {
                                if (!question?.id) return
                                question.state = value ? "ACTIVE" : "INACTIVE"
                                updateQuestionStatus({
                                    questionId: question?.id,
                                    state: value ? "ACTIVE" : "INACTIVE",
                                })
                            }}
                        />
                    )
                },
            },

            {
                id: "actions",
                header: "الإجراءات",
                cell: ({ row }) => {
                    const question = row?.original

                    const updateQuestionLink = hasCategoryId
                        ? `/questions/update/${question?.id}/${categoryId}/${question?.category?.arName}`
                        : `/questions/update/${question?.id}`
                    return (
                        <>
                            <DropdownMenu dir="rtl">
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 focus:ring-3 focus:ring-primary/35">
                                        <MoreVerticalIcon className="size-6" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="overflow-hidden">
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setQuestionForDetails(question)
                                            setDetailsOpen((prev) => !prev)
                                        }}
                                    >
                                        عرض
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => {
                                            setQuestion(question)
                                            setOpen(true)
                                        }}
                                    >
                                        إضافة تعليق
                                    </DropdownMenuItem>

                                    <PermissionsRender
                                        businessModule={PermissionsBusinessModule.QUESTIONS}
                                        permissions={[PermissionEnum.UPDATE]}
                                    >
                                        <DropdownMenuItem asChild>
                                            <Link to={updateQuestionLink}>تعديل</Link>
                                        </DropdownMenuItem>
                                    </PermissionsRender>

                                    <PermissionsRender
                                        businessModule={PermissionsBusinessModule.REPORTS}
                                        permissions={[PermissionEnum.CREATE]}
                                    >
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setQuestion(question)
                                                setReportDialogOpen(true)
                                            }}
                                        >
                                            الإبلاغ عن إجابة خاطئة
                                        </DropdownMenuItem>
                                    </PermissionsRender>

                                    <PermissionsRender
                                        businessModule={PermissionsBusinessModule.QUESTIONS}
                                        permissions={[PermissionEnum.DELETE]}
                                    >
                                        <DropdownMenuItem
                                            className="w-full text-red-500 font-semibold hover:bg-red-50 focus:bg-red-50"
                                            onClick={() => {
                                                setQuestionToDelete(question?.id)
                                                setDeleteDialogOpen(true)
                                            }}
                                        >
                                            حذف
                                        </DropdownMenuItem>
                                    </PermissionsRender>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )
                },
            },
        ],
        [updateQuestionStatus, hasCategoryId, categoryId, retry, reports]
    )
    return (
        <div className={cn("pb-4 flex justify-center flex-col", className)}>
            <AppAlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setQuestionToDelete(null)
                    }
                    setDeleteDialogOpen(open)
                }}
                titleClassName="text-destructive"
                confirmClassName="bg-destructive hover:bg-destructive/80"
                title="تأكيد الحذف"
                description="هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء. سيتم حذف السؤال بشكل دائم من النظام."
                onConfirm={() => {
                    if (questionToDelete) {
                        deleteQuestion(questionToDelete)
                    }
                    setDeleteDialogOpen(false)
                }}
                isLoading={isDeleting}
            />
            <QuestionDetailsDialog
                question={questionForDetails}
                open={detailsOpen}
                onOpenChange={(open) => {
                    setDetailsOpen(open)
                    if (!open) {
                        setQuestionForDetails(undefined)
                    }
                }}
            />

            <QuestionAddEditCommentDialog
                question={question}
                open={open}
                setOpen={setOpen}
                onComplete={() => {
                    retry()
                    setQuestion(undefined)
                    setOpen(false)
                }}
            />

            <QuestionCommentsView
                comments={question?.questionComments}
                open={commentsOpen}
                setOpen={setCommentsOpen}
                onEditCommentComplete={(value) => {
                    if (!value) return

                    const shadowQuestion = { ...question } as QuestionResponse

                    const commentValue = shadowQuestion?.questionComments?.find((comment) => comment?.id === value?.id)

                    if (commentValue) {
                        commentValue.comment = value?.comment
                    }

                    setQuestion(shadowQuestion)
                }}
                onDeleteCommentComplete={(value) => {
                    if (!value) return

                    const shadowQuestion = { ...question } as QuestionResponse

                    const comments = shadowQuestion?.questionComments ?? []

                    const index = comments.findIndex((comment) => comment?.id === value?.id)

                    if (index !== -1) {
                        comments.splice(index, 1)
                    }

                    shadowQuestion.questionComments = comments

                    if (comments?.length === 0) {
                        setCommentsOpen(false)
                    }

                    setQuestion(shadowQuestion)
                }}
            />

            <CreateReportDialog
                question={question}
                open={reportDialogOpen}
                onOpenChange={setReportDialogOpen}
                onSuccess={() => {
                    setReportDialogOpen(false)
                    setQuestion(undefined)
                    retry()
                }}
            />

            <h1 className="text-3xl font-bold tracking-tight">الأسئلة</h1>

            <QuestionsFilter hideCategory={hasCategoryId} className="mt-6" />

            <PermissionsRender
                businessModule={PermissionsBusinessModule.QUESTIONS}
                permissions={[PermissionEnum.CREATE]}
            >
                <div className=" flex justify-end mt-6">
                    <Button size="lg" asChild>
                        <Link to={createQuestionLink}>
                            <PlusIcon className="size-5" />
                            سؤال جديد
                        </Link>
                    </Button>
                </div>
            </PermissionsRender>

            <DataTable
                columns={columns}
                data={questions?.items ?? []}
                loading={isLoading}
                totalPages={questions?.pageInfo?.totalPages ?? 0}
            />
        </div>
    )
}
