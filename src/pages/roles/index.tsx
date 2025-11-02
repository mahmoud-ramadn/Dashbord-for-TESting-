import type { ColumnDef } from "@tanstack/react-table"
import { useAtom } from "jotai"
import { MoreVerticalIcon, PlusIcon } from "lucide-react"

import { useEffect, useMemo, useState } from "react"
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
import { useRoles, useRolesSearchQueryFilterState } from "@/hooks/roles"
import { useDebouncedInput } from "@/hooks/useDebounceInput"

export default function Roles() {
    const { value: roles, loading: isLoading } = useRoles()
    const { query, mutate } = useRolesSearchQueryFilterState()
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

    const columns: ColumnDef<RoleResponse>[] = useMemo(
        () => [
            {
                accessorKey: "name",
                header: "العنوان العربي",
            },

            {
                accessorKey: "description",
                header: "الوصف",
            },
            {
                id: "actions",
                header: "الإجراءات",
                cell: ({ row }) => {
                    const role = row?.original

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
                                        businessModule={PermissionsBusinessModule.ROLES}
                                        permissions={[PermissionEnum.VIEW]}
                                    >
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem>عرض</DropdownMenuItem>
                                        </DialogTrigger>
                                    </PermissionsRender>

                                    <PermissionsRender
                                        businessModule={PermissionsBusinessModule.ROLES}
                                        permissions={[PermissionEnum.UPDATE]}
                                    >
                                        <DropdownMenuItem asChild>
                                            <Link to={`/roles/update/${role?.id}`}>تعديل</Link>
                                        </DropdownMenuItem>
                                    </PermissionsRender>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent className="lg:max-w-2xl">
                                <DialogTitle>عرض الدرو</DialogTitle>

                                <ScrollArea dir="rtl" className="max-h-[calc(90vh-5rem)] px-6 pb-6">
                                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                                        <div className="space-y-2">
                                            <DialogTitle>الاسم العربي</DialogTitle>
                                            <DialogDescription>{role.name}</DialogDescription>
                                        </div>
                                        <div className="space-y-2">
                                            <DialogTitle>الاسم الانجليزي</DialogTitle>
                                            <DialogDescription>{role.description}</DialogDescription>
                                        </div>
                                    </div>
                                </ScrollArea>
                                <ScrollBar orientation="vertical" className="h-3 bg-gray-100 rounded-full" />
                            </DialogContent>
                        </Dialog>
                    )
                },
            },
        ],
        []
    )

    return (
        <div className="container space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">الأدوار</h1>

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

            <PermissionsRender businessModule={PermissionsBusinessModule.ROLES} permissions={[PermissionEnum.CREATE]}>
                <div className="flex justify-end mt-6">
                    <Button size="lg" asChild>
                        <Link to="/roles/create">
                            <PlusIcon className="size-5" />
                            أدوار جديد
                        </Link>
                    </Button>
                </div>
            </PermissionsRender>

            <DataTable
                columns={columns}
                data={roles?.items ?? []}
                loading={isLoading}
                totalPages={roles?.pageInfo?.totalPages ?? 0}
            />
        </div>
    )
}
