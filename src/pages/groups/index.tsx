import type { ColumnDef } from "@tanstack/react-table"
import { useAtom } from "jotai"
import { MoreVerticalIcon, PlusIcon } from "lucide-react"

import { useEffect } from "react"
import { Link } from "react-router-dom"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { queryTableAtom } from "@/atoms"
import PermissionsRender from "@/components/permissions/render"
import { useGroups, useGroupsQueryFilterState } from "@/hooks/groups"

export default function Groups() {
    const { value: groups, loading: isLoading } = useGroups()
    const [, setQueryTable] = useAtom(queryTableAtom)
    const { query } = useGroupsQueryFilterState()

    useEffect(() => {
        setQueryTable({
            page: query.page ?? 1,
            limit: query.limit ?? DEFAULT_PAGE_SIZE,
        })
    }, [query, setQueryTable])

    const columns: ColumnDef<GroupResponse>[] = [
        {
            accessorKey: "arName",
            header: "العنوان العربي",
        },

        {
            id: "actions",
            header: "الإجراءات",
            cell: ({ row }) => {
                const group = row?.original

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
                                        <Link to={`/groups/update/${group?.id}`}>تعديل</Link>
                                    </DropdownMenuItem>
                                </PermissionsRender>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className="lg:max-w-2xl">
                            <DialogTitle>عرض المجموعة</DialogTitle>

                            <ScrollArea dir="rtl" className="max-h-[calc(90vh-5rem)] px-6 pb-6">
                                <div className="grid md:grid-cols-2 gap-6 mt-4">
                                    <div className="space-y-2">
                                        <DialogTitle>الاسم العربي</DialogTitle>
                                        <DialogDescription>{group.arName}</DialogDescription>
                                    </div>
                                    <div className="space-y-2">
                                        <DialogTitle>الاسم الانجليزي</DialogTitle>
                                        <DialogDescription>{group.enName}</DialogDescription>
                                    </div>
                                    <div className="space-y-2">
                                        <DialogTitle>الوصف</DialogTitle>
                                        <DialogDescription>{group.description}</DialogDescription>
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
        <div className="container space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">المجموعات</h1>

            <PermissionsRender businessModule={PermissionsBusinessModule.GROUPS} permissions={[PermissionEnum.CREATE]}>
                <div className="flex justify-end mt-6">
                    <Button size="lg" asChild>
                        <Link to="/groups/create">
                            <PlusIcon className="size-5" />
                            مجموعة جديدة
                        </Link>
                    </Button>
                </div>
            </PermissionsRender>

            <DataTable
                columns={columns}
                data={groups?.items ?? []}
                loading={isLoading}
                totalPages={groups?.pageInfo?.totalPages ?? 0}
            />
        </div>
    )
}
