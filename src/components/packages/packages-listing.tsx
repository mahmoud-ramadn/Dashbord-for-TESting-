import { useMutation } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreVertical, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { useMemo } from "react"
import { Link } from "react-router-dom"

import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { updatePackage } from "@/apis/packages"
import { packagesSubscription } from "@/apis/packages"
import { usePackages } from "@/hooks/packages"

import PermissionsRender from "../permissions/render"
import { Button } from "../ui/button"
import DataTable from "../ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Module from "../ui/module"
import { Switch } from "../ui/switch"
import PackagesFilter from "./packages-filter"

export default function PackagesListing() {
    const { value: packages, loading, retry } = usePackages()

    const { mutate: updatePackageState } = useMutation({
        mutationFn: async ({ packageId, state }: { packageId: string; state: PackageStatus }) => {
            await updatePackage(packageId, { state })
            await retry()
        },
        onSuccess: () => {
            toast.success("تم تغيير حالة الباقة بنجاح")
        },
        onError: () => {
            toast.error("فشل تغيير حالة الباقة")
        },
    })

    const handleSubscribe = async (packageId: string) => {
        try {
            const subscriptionLink = await packagesSubscription(packageId)
            window.open(subscriptionLink, "_blank")
        } catch (error) {
            console.error("Error subscribing to package:", error)
        }
    }

    const columns: ColumnDef<PackagesResponse>[] = useMemo(
        () => [
            {
                accessorKey: "number",
                header: "# الرقم",
                cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            { accessorKey: "arName", header: " اسم الباقة " },
            {
                accessorKey: "photo",
                header: "صورة الباقة",
                cell: ({ row }) => {
                    const packageItem = row.original
                    if (!packageItem?.photo) return <span className="text-gray-400">لا يوجد</span>
                    return <Module src={packageItem.photo} alt={packageItem.id || "صورة الباقة"} />
                },
            },
            {
                accessorKey: "price",
                header: "السعر",
                cell: ({ row }) =>
                    row.original?.price ? (
                        <span>{row.original.price}</span>
                    ) : (
                        <span className="text-gray-400">لا يوجد</span>
                    ),
            },
            {
                accessorKey: "discountPercentage",
                header: "الخصم",
                cell: ({ row }) =>
                    row.original?.discountPercentage == null ? (
                        <span className="text-gray-400">لا يوجد</span>
                    ) : (
                        <>% {row.original.discountPercentage}</>
                    ),
            },

            {
                accessorKey: "state",
                header: "الحالة",
                cell: ({ row }) => {
                    const packageItem = row?.original

                    return (
                        <Switch
                            className="w-12 h-7"
                            checked={packageItem.state === "ACTIVE"}
                            onCheckedChange={(value) => {
                                if (!packageItem?.id) return

                                packageItem.state = value ? "ACTIVE" : "INACTIVE"

                                updatePackageState({
                                    packageId: packageItem?.id,
                                    state: value ? "ACTIVE" : "INACTIVE",
                                })
                            }}
                        />
                    )
                },
            },
            { accessorKey: "games", header: "عدد الألعاب" },
            { accessorKey: "paidCount", header: " عدد مرات الشراء" },
            {
                id: "actions",
                header: "الإجراءات",
                cell: ({ row }) => {
                    const packageItem = row.original
                    return (
                        <Dialog>
                            <DropdownMenu dir="rtl">
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 focus:ring-3 focus:ring-primary/35">
                                        <MoreVertical className="size-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="overflow-hidden">
                                    <DropdownMenuItem asChild>
                                        <PermissionsRender
                                            businessModule={PermissionsBusinessModule.GAME_PACKAGES}
                                            permissions={[PermissionEnum.VIEW]}
                                        >
                                            <DialogTrigger asChild>
                                                <DropdownMenuItem>عرض</DropdownMenuItem>
                                            </DialogTrigger>
                                        </PermissionsRender>
                                    </DropdownMenuItem>
                                    <PermissionsRender
                                        businessModule={PermissionsBusinessModule.GAME_PACKAGES}
                                        permissions={[PermissionEnum.UPDATE]}
                                    >
                                        <DropdownMenuItem asChild>
                                            <Link to={`/packages/update/${packageItem?.id}`}> تعديل </Link>
                                        </DropdownMenuItem>
                                    </PermissionsRender>
                                    <DropdownMenuItem asChild>
                                        <button className="w-full" onClick={() => handleSubscribe(packageItem?.id)}>
                                            اشترك
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent className="lg:max-w-2xl">
                                <DialogTitle>عرض الباقة</DialogTitle>
                                <ScrollArea dir="rtl" className="max-h-[calc(90vh-10rem)] px-6">
                                    <div className="grid md:grid-cols-2 gap-6 mt-4 pb-6">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">الاسم العربي</h4>
                                            <p className="text-sm">{packageItem.arName || "لا يوجد"}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                الاسم الإنجليزي
                                            </h4>
                                            <p className="text-sm">{packageItem.enName || "لا يوجد"}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">السعر</h4>
                                            <p className="text-sm">
                                                {packageItem.price ? `${packageItem.price}` : "لا يوجد"}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">الخصم</h4>
                                            <p className="text-sm">
                                                {packageItem.discountPercentage != null
                                                    ? `% ${packageItem.discountPercentage}`
                                                    : "لا يوجد"}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">عدد الألعاب</h4>
                                            <p className="text-sm">{packageItem.games || "لا يوجد"}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                عدد مرات الشراء
                                            </h4>
                                            <p className="text-sm">{packageItem.paidCount || "لا يوجد"}</p>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">الوصف</h4>
                                            <p className="text-sm">{packageItem.description || "لا يوجد"}</p>
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">صورة الباقة</h4>
                                            {packageItem.photo ? (
                                                <Module
                                                    src={packageItem.photo}
                                                    alt={packageItem.id || "صورة الباقة"}
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
        [updatePackageState]
    )

    return (
        <div className="container">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">الباقات</h1>
            </div>
            <PackagesFilter />

            <PermissionsRender
                businessModule={PermissionsBusinessModule.GAME_PACKAGES}
                permissions={[PermissionEnum.CREATE]}
            >
                <div className=" flex justify-end mt-6">
                    <Button size="lg" asChild>
                        <Link to="/packages/create">
                            <PlusIcon className="size-5" />
                            باقة جديدة
                        </Link>
                    </Button>
                </div>
            </PermissionsRender>
            <DataTable
                columns={columns}
                data={packages?.items ?? []}
                loading={loading}
                totalPages={packages?.pageInfo.totalPages ?? 0}
            />
        </div>
    )
}
