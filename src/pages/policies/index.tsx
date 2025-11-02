import type { ColumnDef } from "@tanstack/react-table"
import { useAtom } from "jotai"
import { MoreVerticalIcon, PlusIcon } from "lucide-react"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { queryTableAtom } from "@/atoms"
import PermissionsRender from "@/components/permissions/render"
import { usePolicies, usePoliciesSearchQueryFilterState } from "@/hooks/policies"
import { useDebouncedInput } from "@/hooks/useDebounceInput"

export default function Policies() {
    const { value: policies, loading: isLoading } = usePolicies()
    const { mutate, query } = usePoliciesSearchQueryFilterState()
    const [searchInput, setSearchInput] = useState(query.search)
    const [, setQueryTable] = useAtom(queryTableAtom)

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

    const columns: ColumnDef<PoliciesResponse>[] = [
        {
            accessorKey: "arContent",
            header: "العنوان العربي",
        },
        {
            id: "actions",
            header: "الإجراءات",
            cell: ({ row }) => {
                const policies = row?.original

                return (
                    <Dialog>
                        <DropdownMenu dir="rtl">
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 focus:ring-3 focus:ring-primary/35">
                                    <MoreVerticalIcon className="size-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <PermissionsRender
                                    businessModule={PermissionsBusinessModule.SETTINGS}
                                    permissions={[PermissionEnum.VIEW]}
                                >
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem>عرض</DropdownMenuItem>
                                    </DialogTrigger>
                                </PermissionsRender>

                                <PermissionsRender
                                    businessModule={PermissionsBusinessModule.SETTINGS}
                                    permissions={[PermissionEnum.UPDATE]}
                                >
                                    <DropdownMenuItem asChild>
                                        <Link to={`/policies/update/${policies?.id}`}>تعديل</Link>
                                    </DropdownMenuItem>
                                </PermissionsRender>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className="lg:max-w-2xl">
                            <DialogTitle>عرض السياسة</DialogTitle>
                            <ScrollArea dir="rtl" className="max-h-[calc(90vh-5rem)] px-6 pb-6">
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <DialogTitle>الاسم العربي</DialogTitle>
                                        <DialogDescription>{policies.arContent}</DialogDescription>
                                    </div>
                                    <div className="space-y-2">
                                        <DialogTitle>الاسم الانجليزي</DialogTitle>
                                        <DialogDescription>{policies.enContent}</DialogDescription>
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
        <div className="container space-y-6 ">
            <h1 className="  text-3xl font-bold tracking-tight">السياسات</h1>
            <Input
                id="search"
                type="text"
                placeholder="بحث..."
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
                        <Link to="/policies/create">
                            <PlusIcon className="size-5" />
                            سياسات جديدة
                        </Link>
                    </Button>
                </div>
            </PermissionsRender>

            <DataTable
                columns={columns}
                data={policies?.items ?? []}
                loading={isLoading}
                totalPages={policies?.pageInfo.totalPages ?? 0}
            />
        </div>
    )
}
