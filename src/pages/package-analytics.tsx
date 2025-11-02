import type { ColumnDef } from "@tanstack/react-table"
import { DollarSign, Download, MoreVertical, ShoppingCart } from "lucide-react"
// adjust path as needed
import { toast } from "sonner"

import { useMemo, useState } from "react"

import { Button, ButtonWithLoading } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Module from "@/components/ui/module"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { getPackageAnalyticsPdf } from "@/apis/package-analytics"
import { usePackagesAnalytics } from "@/hooks/package-analytics"

export default function PackageAnalytics() {
    const { value: packageAnalytics, loading } = usePackagesAnalytics()
    const [downloading, setDownloading] = useState(false)

    const summary = packageAnalytics?.summary

    const handleDownloadPdf = async () => {
        try {
            setDownloading(true)
            const response = await getPackageAnalyticsPdf()

            const blob = new Blob([response as BlobPart], { type: "application/pdf" })

            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `package-analytics-${new Date().toISOString().split("T")[0]}.pdf`

            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            toast.success("تم تحميل ملف التحليلات بنجاح")
        } catch (error) {
            console.error("Error downloading PDF:", error)
            toast.error("فشل تحميل ملف التحليلات")
        } finally {
            setDownloading(false)
        }
    }

    const columns: ColumnDef<PackageAnalyticsItem>[] = useMemo(
        () => [
            {
                accessorKey: "number",
                header: "#",
                cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            { accessorKey: "arName", header: "اسم الباقة" },
            {
                accessorKey: "photo",
                header: "صورة الباقة",
                cell: ({ row }) => {
                    const pkg = row.original
                    return pkg?.photo ? (
                        <Module
                            src={pkg.photo}
                            alt={pkg.arName}
                            thumbnailClassName="size-20 rounded-md object-cover border"
                        />
                    ) : (
                        <span className="text-gray-400">لا يوجد</span>
                    )
                },
            },
            {
                accessorKey: "price",
                header: "السعر",
                cell: ({ row }) => <span>{row.original.price ?? "لا يوجد"} ج.م</span>,
            },
            {
                accessorKey: "discountPercentage",
                header: "الخصم",
                cell: ({ row }) => (
                    <span>{row.original.discountPercentage ? `% ${row.original.discountPercentage}` : "لا يوجد"}</span>
                ),
            },
            { accessorKey: "games", header: "عدد الألعاب" },
            { accessorKey: "paidCount", header: "عدد مرات الشراء" },
            {
                accessorKey: "amount",
                header: "إجمالي الإيرادات",
                cell: ({ row }) => <span>{row.original.amount ?? 0} ج.م</span>,
            },
            {
                accessorKey: "state",
                header: "الحالة",
                cell: ({ row }) => (
                    <span className={row.original.state === "ACTIVE" ? "text-green-600" : "text-red-600"}>
                        {row.original.state === "ACTIVE" ? "نشط" : "غير نشط"}
                    </span>
                ),
            },
            {
                accessorKey: "createdAt",
                header: "تاريخ الإنشاء",
                cell: ({ row }) => <span>{new Date(row.original.createdAt).toLocaleDateString("ar-EG")}</span>,
            },
            {
                id: "actions",
                header: "الإجراءات",
                cell: ({ row }) => {
                    const pkg = row.original
                    return (
                        <Dialog>
                            <DropdownMenu dir="rtl">
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreVertical className="size-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem>عرض</DropdownMenuItem>
                                        </DialogTrigger>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent className="lg:max-w-2xl">
                                <DialogTitle>عرض الباقة</DialogTitle>
                                <ScrollArea dir="rtl" className="max-h-[calc(90vh-10rem)] px-6">
                                    <div className="grid md:grid-cols-2 gap-6 mt-4 pb-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">الاسم العربي</h4>
                                            <p className="text-sm">{pkg.arName || "لا يوجد"}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                الاسم الإنجليزي
                                            </h4>
                                            <p className="text-sm">{pkg.enName || "لا يوجد"}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">السعر</h4>
                                            <p className="text-sm">{pkg.price ?? "لا يوجد"} ج.م</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">الخصم</h4>
                                            <p className="text-sm">
                                                {pkg.discountPercentage ? `% ${pkg.discountPercentage}` : "لا يوجد"}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">عدد الألعاب</h4>
                                            <p className="text-sm">{pkg.games ?? "لا يوجد"}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                عدد مرات الشراء
                                            </h4>
                                            <p className="text-sm">{pkg.paidCount ?? "لا يوجد"}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                إجمالي الإيرادات
                                            </h4>
                                            <p className="text-sm">{pkg.amount ?? 0} ج.م</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">الحالة</h4>
                                            <p
                                                className={`text-sm font-medium ${
                                                    pkg.state === "ACTIVE" ? "text-green-600" : "text-red-600"
                                                }`}
                                            >
                                                {pkg.state === "ACTIVE" ? "نشط" : "غير نشط"}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">تاريخ الإنشاء</h4>
                                            <p className="text-sm">
                                                {new Date(pkg.createdAt).toLocaleDateString("ar-EG")}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                تاريخ آخر تحديث
                                            </h4>
                                            <p className="text-sm">
                                                {new Date(pkg.updatedAt).toLocaleDateString("ar-EG")}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">الوصف</h4>
                                            <p className="text-sm">{pkg.description || "لا يوجد"}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">صورة الباقة</h4>
                                            {pkg.photo ? (
                                                <Module
                                                    src={pkg.photo}
                                                    alt={pkg.id || "صورة الباقة"}
                                                    thumbnailClassName="size-20 rounded-md object-cover border"
                                                />
                                            ) : (
                                                <p className="text-sm text-muted-foreground">لا يوجد</p>
                                            )}
                                        </div>
                                    </div>
                                    <ScrollBar orientation="vertical" />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    )
                },
            },
        ],
        []
    )

    return (
        <div className="container">
            <h1 className="text-2xl mt-4 font-semibold">تحليل الباقات</h1>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 my-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 flex-1">
                    <div className=" rounded-xl p-5 sm:p-6  border border-blue-200">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide">
                                    إجمالي الإيرادات
                                </p>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold  truncate">
                                    {summary?.totalAmount}
                                </p>
                                <p className=" text-xs mt-1">من جميع الباقات</p>
                            </div>
                            <div className="bg-green-500 rounded-full p-3 sm:p-4  transition-colors shrink-0">
                                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className=" border border-blue-200 rounded-xl p-5 sm:p-6 ">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wide">
                                    إجمالي المبيعات
                                </p>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold truncate">
                                    {summary?.totalCounts}
                                </p>
                                <p className="text-xs mt-1">عملية شراء</p>
                            </div>
                            <div className="bg-blue-500 rounded-full p-3 sm:p-4  shrink-0">
                                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ButtonWithLoading
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="w-full sm:w-auto lg:w-auto px-6 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
                loading={downloading}
            >
                <Download className="ml-2 h-5 w-5" />
                تحميل ملف التحليلات
            </ButtonWithLoading>

            <DataTable
                columns={columns}
                data={packageAnalytics?.packageAnalytics ?? []}
                loading={loading}
                totalPages={0}
            />
        </div>
    )
}
