import { useMutation } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { useAtom } from "jotai"
import { MoreVerticalIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import AppAlertDialog from "@/components/ui/app-alert-dialog"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { deleteTermsAndConditions as deleteTermsAndConditionsApi } from "@/apis/terms-and-conditions"
import { queryTableAtom } from "@/atoms"
import PermissionsRender from "@/components/permissions/render"
import { useTermsAndConditions, useTermsAndConditionsSearchQueryFilterState } from "@/hooks/terms-and-conditions"
import { useDebouncedInput } from "@/hooks/useDebounceInput"

export default function TermsAndConditions() {
    const { value: termsAndConditions, loading: isLoading, retry } = useTermsAndConditions()
    const { query, mutate } = useTermsAndConditionsSearchQueryFilterState()

    const [searchInput, setSearchInput] = useState(query.search)
    const [, setQueryTable] = useAtom(queryTableAtom)
    const [TermToDelete, setTermToDelete] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)

    const { value: debouncedSearch, handleChange } = useDebouncedInput(300, query.search)
    useEffect(() => {
        setSearchInput(query.search)
    }, [query.search])

    useEffect(() => {
        if (debouncedSearch !== query.search) {
            mutate({ search: debouncedSearch, page: 1 })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch])
    useEffect(() => {
        setQueryTable({
            page: query.page ?? 1,
            limit: query.limit ?? DEFAULT_PAGE_SIZE,
        })
    }, [query, setQueryTable])
    const { mutate: deleteTermsAndConditions, isPending: isDeleting } = useMutation({
        mutationFn: async (id: string) => {
            await deleteTermsAndConditionsApi(id)
        },
        onSuccess: () => {
            toast.success("تم حذف الشرط بنجاح")
            retry()
        },
        onError: () => {
            toast.error("فشل حذف الشرط")
        },
    })

    const columns: ColumnDef<TermsAndConditionsResponse>[] = [
        {
            accessorKey: "arContent",
            header: "العنوان العربي",
        },
        {
            id: "actions",
            header: "الإجراءات",
            cell: ({ row }) => {
                const termsAndConditions = row?.original

                return (
                    <Dialog>
                        <DropdownMenu dir="rtl">
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 focus:ring-3 focus:ring-primary/35">
                                    <MoreVerticalIcon className="size-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>عرض</DropdownMenuItem>
                                </DialogTrigger>

                                <PermissionsRender
                                    businessModule={PermissionsBusinessModule.GROUPS}
                                    permissions={[PermissionEnum.UPDATE]}
                                >
                                    <DropdownMenuItem asChild>
                                        <Link to={`/terms-and-conditions/update/${termsAndConditions?.id}`}>تعديل</Link>
                                    </DropdownMenuItem>
                                </PermissionsRender>
                                <PermissionsRender
                                    businessModule={PermissionsBusinessModule.GROUPS}
                                    permissions={[PermissionEnum.DELETE]}
                                >
                                    <DropdownMenuItem
                                        asChild
                                        className="w-full text-red-500 font-semibold hover:bg-red-50 focus:bg-red-50"
                                        onClick={() => {
                                            setTermToDelete(termsAndConditions?.id)
                                            setDeleteDialogOpen(true)
                                        }}
                                    >
                                        <span>حذف</span>
                                    </DropdownMenuItem>
                                </PermissionsRender>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className="lg:max-w-2xl">
                            <DialogTitle>عرض الشروط والأحكام</DialogTitle>
                            <ScrollArea dir="rtl" className="max-h-[calc(90vh-5rem)] px-6 pb-6">
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <DialogTitle>الاسم العربي</DialogTitle>
                                        <DialogDescription>{termsAndConditions.arContent}</DialogDescription>
                                    </div>
                                    <div className="space-y-2">
                                        <DialogTitle>الاسم الانجليزي</DialogTitle>
                                        <DialogDescription>{termsAndConditions.enContent}</DialogDescription>
                                    </div>
                                </div>
                            </ScrollArea>
                            <ScrollBar orientation="vertical" className="h-3 bg-gray-100 rounded-full" />
                        </DialogContent>
                    </Dialog>
                )
            },
        },
    ]

    return (
        <>
            <AppAlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setTermToDelete(null)
                    }
                    setDeleteDialogOpen(open)
                }}
                titleClassName="text-destructive"
                confirmClassName="bg-destructive hover:bg-destructive/80"
                title="تأكيد حذف الشروط والأحكام"
                description="هل أنت متأكد من حذف هذا الشرط؟ لا يمكن التراجع عن هذا الإجراء. سيتم حذف الشرط بشكل دائم من النظام."
                onConfirm={() => {
                    if (TermToDelete) {
                        deleteTermsAndConditions(TermToDelete)
                    }
                    setDeleteDialogOpen(false)
                }}
                isLoading={isDeleting}
            />

            <div className="container space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">الشروط والأحكام</h1>
                <Input
                    id="search"
                    type="text"
                    placeholder="ابحث بالعنوان العربي أو الانجليزي..."
                    value={searchInput}
                    onChange={(e) => {
                        const newValue = e.target.value
                        setSearchInput(newValue)
                        handleChange(newValue)
                    }}
                    className="w-full md:w-80 mt-6"
                />
                <PermissionsRender
                    businessModule={PermissionsBusinessModule.SETTINGS}
                    permissions={[PermissionEnum.CREATE]}
                >
                    <div className="flex justify-end mt-6">
                        <Button size="lg" asChild>
                            <Link to="/terms-and-conditions/create">
                                <PlusIcon className="size-5" />
                                شروط وأحكام جديدة
                            </Link>
                        </Button>
                    </div>
                </PermissionsRender>

                <DataTable
                    columns={columns}
                    data={termsAndConditions?.items ?? []}
                    loading={isLoading}
                    totalPages={termsAndConditions?.pageInfo?.totalPages ?? 0}
                />
            </div>
        </>
    )
}
