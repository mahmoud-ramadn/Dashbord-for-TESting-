// import { formatDistanceToNow } from "date-fns"
// import { ar } from "date-fns/locale"
import { Bell } from "lucide-react"

import { useState } from "react"
import { Link } from "react-router"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// import { useNotificationsCount } from "@/hooks/notifications"
// import { useReportsHandleNotification } from "@/hooks/reports"

// import { Badge } from "../ui/badge"
// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
// import Module from "../ui/module"

export default function Notification() {
    const [open, setOpen] = useState(false)

    // const { reportsNotificationCount, query } = useReportsHandleNotification()

    // const { value: count } = useNotificationsCount()

    // const getPriorityConfig = (count: number) => {
    //     if (count >= 10) return { level: "عالية جداً", color: "text-red-600", bgColor: "bg-red-50", icon: true }
    //     if (count >= 5) return { level: "عالية", color: "text-orange-600", bgColor: "bg-orange-50", icon: true }
    //     if (count >= 3) return { level: "متوسطة", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: false }
    //     return { level: "عادية", color: "text-gray-600", bgColor: "bg-gray-50", icon: false }
    // }

    // const getStatusConfig = (status: string) => {
    //     const statusMap: Record<
    //         string,
    //         { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
    //     > = {
    //         جديد: { variant: "default", label: "جديد" },
    //         "قيد المراجعة": { variant: "secondary", label: "قيد المراجعة" },
    //         "تم الحل": { variant: "outline", label: "تم الحل" },
    //         "تم الرفض": { variant: "destructive", label: "تم الرفض" },
    //     }
    //     return statusMap[status] || { variant: "default", label: status }
    // }

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button className="relative gap-2 cursor-pointer size-12 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors rounded-full group">
                        <Bell className="size-5 text-white" />

                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                            8
                        </span>
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-0" align="end" sideOffset={10}>
                    <div className="p-4 border-b">
                        <h3 className="font-semibold text-lg">التقارير الجديدة</h3>
                        {/* <p className="text-sm text-muted-foreground">لديك {reportsNotificationCount} تقرير جديد</p> */}
                    </div>

                    <ScrollArea className="h-[400px]">
                        <div className="divide-y">
                            {/* {query.data?.items
                                .sort((a, b) => {
                                    const dateA = new Date(a?.createdAt ?? 0).getTime()
                                    const dateB = new Date(b?.createdAt ?? 0).getTime()
                                    return dateB - dateA
                                })
                                .slice(0, 5)
                                .map((report: ReportResponse) => (
                                    <Dialog key={report.id}>
                                        <DialogTrigger asChild>
                                            <button className="w-full p-4 cursor-pointer hover:bg-accent transition-colors text-right">
                                                <div className="flex items-start gap-3">
                                                    <div className="size-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-sm line-clamp-1 mb-1">
                                                            {report.question.name || "تقرير بدون عنوان"}
                                                        </h4>

                                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                            {report.reason}
                                                        </p>

                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Clock className="size-3" />
                                                            <span>
                                                                {report.createdAt
                                                                    ? formatDistanceToNow(new Date(report.createdAt), {
                                                                          addSuffix: true,
                                                                          locale: ar,
                                                                      })
                                                                    : "منذ لحظات"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </DialogTrigger>

                                        <DialogContent className="lg:max-w-2xl rounded-lg">
                                            <DialogTitle>عرض التقرير</DialogTitle>

                                            <div className="grid md:grid-cols-2 gap-6 mt-4 pb-6">
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-muted-foreground mt-2">
                                                        تاريخ الإنشاء
                                                    </h4>
                                                    <p className="text-sm">
                                                        {new Date(report.createdAt).toLocaleString("ar-EG")}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-muted-foreground">
                                                        المُبلّغ
                                                    </h4>
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <p className="text-sm font-semibold">
                                                                {report?.createdByUser?.name || "غير معروف"}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {report?.createdByUser?.name || ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-muted-foreground">
                                                        السؤال
                                                    </h4>
                                                    <p className="text-sm">{report?.question?.name || "لا يوجد"}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-muted-foreground">
                                                        الإجابة الصحيحة
                                                    </h4>
                                                    <p className="text-sm text-green-600 font-medium">
                                                        {report?.correctAnswerAtReport || "لا يوجد"}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-muted-foreground">
                                                        إجابة المستخدم
                                                    </h4>
                                                    <p className="text-sm text-red-500 font-medium">
                                                        {report?.selectedAnswer || "لا يوجد"}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-muted-foreground">السبب</h4>
                                                    <p className="text-sm">{report?.reason || "لا يوجد"}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-muted-foreground">
                                                        الحالة الحالية
                                                    </h4>
                                                    <Badge variant={getStatusConfig(report?.status).variant}>
                                                        {getStatusConfig(report?.status).label}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-muted-foreground">
                                                        الأولوية
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        {(() => {
                                                            const priority = getPriorityConfig(
                                                                report?.question.reportsCount ?? 0
                                                            )
                                                            return (
                                                                <div
                                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${priority.bgColor}`}
                                                                >
                                                                    {priority.icon && (
                                                                        <AlertCircle
                                                                            className={`size-4 ${priority.color}`}
                                                                        />
                                                                    )}
                                                                    <span
                                                                        className={`text-sm font-medium ${priority.color}`}
                                                                    >
                                                                        {priority.level}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        ({report.question.reportsCount} تقارير)
                                                                    </span>
                                                                </div>
                                                            )
                                                        })()}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-muted-foreground">الوصف</h4>
                                                    <p className="text-sm">{report?.details || "لا يوجد"}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-muted-foreground">
                                                        صورة الإجابة
                                                    </h4>
                                                    {report?.question.answerPhoto ? (
                                                        <Module
                                                            src={report?.question.answerPhoto}
                                                            alt={report?.question.id || "صورة الإجابة"}
                                                            thumbnailClassName="size-20 rounded-md object-cover border"
                                                        />
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">لا يوجد</p>
                                                    )}
                                                </div>

                                                {report?.dismissedNote && (
                                                    <div className="space-y-2 col-span-2">
                                                        <h4 className="text-sm font-medium text-muted-foreground">
                                                            ملاحظة المشرف
                                                        </h4>
                                                        <p className="text-sm text-gray-700">{report?.dismissedNote}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ))} */}
                        </div>
                    </ScrollArea>

                    <Separator />

                    <div className="p-3">
                        <Link
                            to="/reports"
                            onClick={() => setOpen(false)}
                            className="block w-full text-center text-sm font-medium text-primary hover:underline py-2"
                        >
                            عرض جميع التقارير
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    )
}
