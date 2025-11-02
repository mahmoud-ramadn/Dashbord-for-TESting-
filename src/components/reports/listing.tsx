import type { ColumnDef } from "@tanstack/react-table"
import { AlertCircle, MoreVertical } from "lucide-react"

import { useMemo, useState } from "react"
import { Link } from "react-router"

import { formatDate } from "@/lib/map"
import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import { useReports } from "@/hooks/reports"

import { ReportUpdateForm } from "../forms/reports/updat-reports-statue"
import PermissionsRender from "../permissions/render"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import DataTable from "../ui/data-table"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Module from "../ui/module"
import ReportsFilters from "./reports-filters"

type Props = {
    QuestionQId?: string | null
}

const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
        جديد: { variant: "default", label: "جديد" },
        "قيد المراجعة": { variant: "secondary", label: "قيد المراجعة" },
        "تم الحل": { variant: "outline", label: "تم الحل" },
        "تم الرفض": { variant: "destructive", label: "تم الرفض" },
    }
    return statusMap[status] || { variant: "default", label: status }
}

const getPriorityConfig = (count: number) => {
    if (count >= 10) return { level: "عالية جداً", color: "text-red-600", bgColor: "bg-red-50", icon: true }
    if (count >= 5) return { level: "عالية", color: "text-orange-600", bgColor: "bg-orange-50", icon: true }
    if (count >= 3) return { level: "متوسطة", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: false }
    return { level: "عادية", color: "text-gray-600", bgColor: "bg-gray-50", icon: false }
}

export default function ReportsListing({ QuestionQId }: Readonly<Props>) {
    const { value: reports, loading, retry } = useReports(QuestionQId ?? undefined)
    const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({})

    const columns: ColumnDef<ReportResponse>[] = useMemo(
        () => [
            {
                accessorKey: "number",
                header: "# الرقم",
                cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                accessorKey: "game",
                header: "اللعبة",
                cell: ({ row }) => {
                    const game = row?.original?.game
                    if (!game?.name) return <span className="text-gray-400">لا يوجد</span>
                    return <p>{game.name}</p>
                },
            },
            {
                id: "question-name",
                accessorKey: "question.name",
                header: "السؤال",
                cell: ({ row }) => {
                    const question = row?.original
                    if (!question?.question.name) return <span className="text-gray-400">لا يوجد</span>
                    return <p>{question.question.name}</p>
                },
            },
            {
                accessorKey: "correctAnswerAtReport",
                header: "الإجابة المختارة",
            },
            {
                accessorKey: "reason",
                header: "السبب",
            },
            {
                accessorKey: "createdByUser",
                header: "اسم المبلِّغ",
                cell: ({ row }) => {
                    const ReportItem = row.original
                    if (!ReportItem?.createdByUser?.name) return <span className="text-gray-400">لا يوجد</span>
                    return <p>{ReportItem.createdByUser.name}</p>
                },
            },
            {
                header: "تاريخ ووقت الإرسال",
                accessorKey: "createdAt",
                cell: ({ row }) => {
                    const ReportItem = row.original
                    return (
                        <div className="flex flex-col gap-1">
                            <p className="text-sm">{formatDate(ReportItem.createdAt)}</p>
                        </div>
                    )
                },
            },
            {
                accessorKey: "status",
                header: "الحالة",
                cell: ({ row }) => {
                    const status = row.original.status
                    const config = getStatusConfig(status)
                    return (
                        <Badge variant={config.variant} className="font-medium">
                            {config.label}
                        </Badge>
                    )
                },
            },
            {
                id: "reports-count",
                header: "الأولوية",
                cell: ({ row }) => {
                    const ReportItem = row.original
                    const count = ReportItem.question.reportsCount
                    const priority = getPriorityConfig(count ?? 0)

                    return (
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${priority.bgColor}`}>
                                {priority.icon && <AlertCircle className={`size-4 ${priority.color}`} />}
                                <span className={`text-sm font-medium ${priority.color}`}>{priority.level}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                ({count} {count === 1 ? "تقرير" : "تقارير"})
                            </span>
                        </div>
                    )
                },
            },
            {
                id: "actions",
                header: "الإجراءات",
                cell: ({ row }) => {
                    const ReportItem = row.original
                    return (
                        <Dialog
                            open={openDialogs[ReportItem.id]}
                            onOpenChange={(open) => {
                                setOpenDialogs((prev) => ({ ...prev, [ReportItem.id]: open }))
                            }}
                        >
                            <DropdownMenu dir="rtl">
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0  rounded-lg">
                                        <MoreVertical className="size-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="overflow-hidden  flex   flex-col">
                                    <DropdownMenuItem asChild>
                                        <PermissionsRender
                                            businessModule={PermissionsBusinessModule.REPORTS}
                                            permissions={[PermissionEnum.UPDATE]}
                                        >
                                            <DialogTrigger asChild>
                                                <span className="w-full text-right px-2 py-1.5 cursor-pointer">
                                                    عرض التفاصيل
                                                </span>
                                            </DialogTrigger>
                                        </PermissionsRender>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <PermissionsRender
                                            businessModule={PermissionsBusinessModule.QUESTIONS}
                                            permissions={[PermissionEnum.UPDATE]}
                                        >
                                            <Link
                                                to={`/questions/update/${ReportItem?.question?.id}`}
                                                className="w-full text-right px-2 py-1.5 cursor-pointer"
                                            >
                                                تعديل السؤال
                                            </Link>
                                        </PermissionsRender>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent className="lg:max-w-2xl rounded-lg">
                                <DialogTitle>عرض التقرير</DialogTitle>

                                <div className="grid md:grid-cols-2 gap-6 mt-4 pb-6">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground mt-2">
                                            تاريخ الإنشاء
                                        </h4>
                                        <p className="text-sm">
                                            {new Date(ReportItem.createdAt).toLocaleString("ar-EG")}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">المُبلّغ</h4>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {ReportItem.createdByUser?.name || "غير معروف"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {ReportItem.createdByUser?.name || ""}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">السؤال</h4>
                                        <p className="text-sm">{ReportItem.question?.name || "لا يوجد"}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">الإجابة الصحيحة</h4>
                                        <p className="text-sm text-green-600 font-medium">
                                            {ReportItem.correctAnswerAtReport || "لا يوجد"}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">إجابة المستخدم</h4>
                                        <p className="text-sm text-red-500 font-medium">
                                            {ReportItem.selectedAnswer || "لا يوجد"}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">السبب</h4>
                                        <p className="text-sm">{ReportItem.reason || "لا يوجد"}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">الحالة الحالية</h4>
                                        <Badge variant={getStatusConfig(ReportItem.status).variant}>
                                            {getStatusConfig(ReportItem.status).label}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">الأولوية</h4>
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const priority = getPriorityConfig(
                                                    ReportItem.question.reportsCount ?? 0
                                                )
                                                return (
                                                    <div
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${priority.bgColor}`}
                                                    >
                                                        {priority.icon && (
                                                            <AlertCircle className={`size-4 ${priority.color}`} />
                                                        )}
                                                        <span className={`text-sm font-medium ${priority.color}`}>
                                                            {priority.level}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            ({ReportItem.question.reportsCount} تقارير)
                                                        </span>
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">الوصف</h4>
                                        <p className="text-sm">{ReportItem.details || "لا يوجد"}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">صورة الإجابة</h4>
                                        {ReportItem.question.answerPhoto ? (
                                            <Module
                                                src={ReportItem.question.answerPhoto}
                                                alt={ReportItem.question.id || "صورة الإجابة"}
                                                thumbnailClassName="size-20 rounded-md object-cover border"
                                            />
                                        ) : (
                                            <p className="text-sm text-muted-foreground">لا يوجد</p>
                                        )}
                                    </div>

                                    {ReportItem.dismissedNote && (
                                        <div className="space-y-2 col-span-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">ملاحظة المشرف</h4>
                                            <p className="text-sm text-gray-700">{ReportItem.dismissedNote}</p>
                                        </div>
                                    )}

                                    <div className="space-y-3 col-span-2 pt-4">
                                        <ReportUpdateForm
                                            key={ReportItem.id + ReportItem.updatedAt}
                                            reportId={ReportItem.id}
                                            retry={retry}
                                            onSuccess={() => {
                                                setOpenDialogs((prev) => ({
                                                    ...prev,
                                                    [ReportItem.id]: false,
                                                }))
                                            }}
                                        />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )
                },
            },
        ],
        [openDialogs, retry]
    )

    return (
        <div className="container">
            <h1 className="text-3xl font-bold tracking-tight">{QuestionQId ? " التقرير " : " التقارير "} </h1>
            {!QuestionQId && <ReportsFilters />}
            <DataTable
                columns={columns}
                data={reports?.items ?? []}
                loading={loading}
                totalPages={reports?.pageInfo?.totalPages ?? 0}
            />
        </div>
    )
}
