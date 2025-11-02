import { useMutation } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { useAtom } from "jotai"
import { MoreVerticalIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"

import { CategoryStatustype, DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import AppAlertDialog from "@/components/ui/app-alert-dialog"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Module from "@/components/ui/module"
import StatusFilterDropdown from "@/components/ui/status-filter-dropdown"
import { Switch } from "@/components/ui/switch"

import { deleteCategory as deleteCategoryApi, updateCategory } from "@/apis/categories"
import { queryTableAtom } from "@/atoms"
import PermissionsRender from "@/components/permissions/render"
import { useCategories, useCategoryQueryFilterState } from "@/hooks/categories"

type FilterForm = {
    isActive: boolean
}

export default function Categories() {
    const [CatgoryToDelete, setCatgoryToDelete] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const { value: categories, loading: isLoading, retry } = useCategories()
    const [, setQueryTable] = useAtom(queryTableAtom)

    const { query, mutate } = useCategoryQueryFilterState()
    const form = useForm<FilterForm>({
        defaultValues: {
            isActive: query.state === CategoryStatustype.ACTIVE,
        },
    })

    useEffect(() => {
        setQueryTable({
            page: query.page ?? 1,
            limit: query.limit ?? DEFAULT_PAGE_SIZE,
        })
    }, [query, setQueryTable])

    const { mutate: updatCategoryState } = useMutation({
        mutationFn: async ({
            categoryId,
            state,
            groupId,
            enName,
            arName,
        }: {
            categoryId: string
            state: CategoryStatus
            groupId: string
            arName: string
            enName: string
        }) => {
            await updateCategory(categoryId, { state, groupId, enName, arName })
            await retry()
        },
        onSuccess: () => {
            toast.success("تم تغيير حالة التصنيف بنجاح")
        },
        onError: () => {
            toast.error("فشل في تغيير حالة التصنيف")
        },
    })

    const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
        mutationFn: async (id: string) => {
            await deleteCategoryApi(id)
        },
        onSuccess: () => {
            toast.success("تم حذف التصنيف بنجاح")
            retry()
        },
        onError: () => {
            toast.error("فشل حذف التصنيف")
        },
    })

    const handleResetFilter = () => {
        form.setValue("isActive", false)
        mutate({
            state: "",
            limit: DEFAULT_PAGE_SIZE,
            page: 1,
        })
    }

    const columns: ColumnDef<CategoryResponse>[] = useMemo(
        () => [
            {
                accessorKey: "number",
                header: "# الرقم",
                cell: ({ row }) => {
                    return <span>{row.index + 1}</span>
                },
            },
            {
                accessorKey: "arName",
                header: "العنوان العربي",
            },
            {
                accessorKey: "description",
                header: "الوصف",
            },
            {
                accessorKey: "photo",
                header: "صورة التصنيف",
                cell: ({ row }) => {
                    const packageItem = row.original
                    if (!packageItem?.photo) return <span className="text-gray-400">لا يوجد</span>
                    return <Module src={packageItem.photo} alt={packageItem.id || "صورة الباقة"} />
                },
            },
            {
                accessorKey: "group.arName",
                header: "المجموعة",
            },
            {
                accessorKey: "state",
                header: "الحالة",
                cell: ({ row }) => {
                    const categoryItem = row?.original

                    return (
                        <Switch
                            className="w-12 h-7"
                            checked={categoryItem.state === "ACTIVE"}
                            onCheckedChange={(value) => {
                                if (!categoryItem?.id) return

                                updatCategoryState({
                                    categoryId: categoryItem.id,
                                    state: value ? "ACTIVE" : "INACTIVE",
                                    groupId: categoryItem.group.id,
                                    enName: categoryItem.enName,
                                    arName: categoryItem.arName,
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
                    const category = row?.original

                    return (
                        <DropdownMenu dir="rtl">
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 focus:ring-3 focus:ring-primary/35">
                                    <MoreVerticalIcon className="size-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link to={`/categories/${category?.id}`}>عرض</Link>
                                </DropdownMenuItem>
                                <PermissionsRender
                                    businessModule={PermissionsBusinessModule.CATEGORIES}
                                    permissions={[PermissionEnum.UPDATE]}
                                >
                                    <DropdownMenuItem asChild>
                                        <Link to={`/categories/update/${category?.id}`}>تعديل</Link>
                                    </DropdownMenuItem>
                                </PermissionsRender>
                                <PermissionsRender
                                    businessModule={PermissionsBusinessModule.CATEGORIES}
                                    permissions={[PermissionEnum.DELETE]}
                                >
                                    <DropdownMenuItem
                                        className="w-full text-red-500 font-semibold hover:bg-red-50 focus:bg-red-50"
                                        onClick={() => {
                                            setCatgoryToDelete(category?.id)
                                            setDeleteDialogOpen(true)
                                        }}
                                    >
                                        حذف
                                    </DropdownMenuItem>
                                </PermissionsRender>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                },
            },
        ],
        [updatCategoryState]
    )

    return (
        <>
            <AppAlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setCatgoryToDelete(null)
                    }
                    setDeleteDialogOpen(open)
                }}
                titleClassName="text-destructive"
                confirmClassName="bg-destructive hover:bg-destructive/80"
                title="تأكيد الحذف"
                description="هل أنت متأكد من حذف هذا التصنيف؟ لا يمكن التراجع عن هذا الإجراء. سيتم حذف التصنيف بشكل دائم من النظام."
                onConfirm={() => {
                    if (CatgoryToDelete) {
                        deleteCategory(CatgoryToDelete)
                    }
                    setDeleteDialogOpen(false)
                }}
                isLoading={isDeleting}
            />

            <div className="container space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">التصنيفات</h1>
                </div>

                <StatusFilterDropdown
                    value={query.state || ""}
                    onValueChange={(value) => {
                        mutate({
                            state: value,
                            page: 1,
                        })
                    }}
                    onReset={handleResetFilter}
                    label="حالة التصنيفات"
                    activeLabel="نشط"
                    inactiveLabel="غير نشط"
                    allLabel="الكل"
                />

                <PermissionsRender
                    businessModule={PermissionsBusinessModule.CATEGORIES}
                    permissions={[PermissionEnum.CREATE]}
                >
                    <div className="flex justify-end">
                        <Button size="lg" asChild>
                            <Link to="/categories/create" className="flex items-center gap-2">
                                <PlusIcon className="size-5" />
                                تصنيف جديد
                            </Link>
                        </Button>
                    </div>
                </PermissionsRender>

                <DataTable
                    columns={columns}
                    data={categories?.items ?? []}
                    loading={isLoading}
                    totalPages={categories?.pageInfo?.totalPages ?? 0}
                />
            </div>
        </>
    )
}
