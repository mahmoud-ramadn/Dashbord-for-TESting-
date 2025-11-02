import { useMutation } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreVerticalIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { useMemo } from "react"
import { Link } from "react-router-dom"

import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"

import { updateUser } from "@/apis/users"
import PermissionsRender from "@/components/permissions/render"
import UsersFilter from "@/components/users/users-filter"
import { useUsers } from "@/hooks/users"

export default function Users() {
    const { value: users, loading: isLoading } = useUsers()

    const { mutate: updateUsersState } = useMutation({
        mutationFn: async ({ userId, state }: { userId: string; state: UsersStatus }) => {
            await updateUser(userId, { state })
        },
        onSuccess: () => {
            toast.success("تغير حالة المستخدم ")
        },
        onError: () => {
            toast.error("فشل تغير حالة المستخدم")
        },
    })

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                accessorKey: "number",
                header: "# الرقم",
                cell: ({ row }) => <span>{row.index + 1}</span>,
            },
            {
                accessorKey: "name",
                header: "الاسم",
            },
            {
                id: "email",
                header: "البريد الإلكتروني",
                cell: ({ row }) => {
                    const user = row?.original
                    return <span>{user?.userAuthentications?.[0]?.email || "لا يوجد"}</span>
                },
            },
            {
                accessorKey: "state",
                header: "الحالة",
                cell: ({ row }) => {
                    const UserItem = row?.original

                    return (
                        <Switch
                            className="w-12 h-7"
                            checked={UserItem.state === "ACTIVE"}
                            onCheckedChange={(value) => {
                                if (!UserItem?.id) return

                                UserItem.state = value ? "ACTIVE" : "INACTIVE"

                                updateUsersState({
                                    userId: UserItem?.id,
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
                    const user = row?.original
                    return (
                        <Dialog>
                            <DropdownMenu dir="rtl">
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 focus:ring-3 focus:ring-primary/35">
                                        <MoreVerticalIcon className="size-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem>عرض</DropdownMenuItem>
                                        </DialogTrigger>
                                    </DropdownMenuItem>
                                    <PermissionsRender
                                        businessModule={PermissionsBusinessModule.USERS}
                                        permissions={[PermissionEnum.UPDATE]}
                                    >
                                        <DropdownMenuItem asChild>
                                            <Link to={`/users/update/${user?.id}`}>تعديل</Link>
                                        </DropdownMenuItem>
                                    </PermissionsRender>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent className="lg:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>عرض المستخدم</DialogTitle>
                                </DialogHeader>
                                <ScrollArea dir="rtl" className="max-h-[calc(90vh-10rem)] px-6">
                                    <div className="grid md:grid-cols-2 gap-6 mt-4 pb-6">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">الاسم</h4>
                                            <p className="text-sm">{user?.name || "لا يوجد"}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                البريد الإلكتروني
                                            </h4>
                                            <p className="text-sm">
                                                {user?.userAuthentications?.[0]?.email || "لا يوجد"}
                                            </p>
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
        [updateUsersState]
    )

    return (
        <div className="container space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">المستخدمين</h1>

            <UsersFilter />

            <PermissionsRender businessModule={PermissionsBusinessModule.USERS} permissions={[PermissionEnum.CREATE]}>
                <div className="flex justify-end">
                    <Button size="lg" asChild>
                        <Link to="/users/create">
                            <PlusIcon className="size-5" />
                            مستخدم جديد
                        </Link>
                    </Button>
                </div>
            </PermissionsRender>

            <DataTable
                columns={columns}
                data={users?.items ?? []}
                loading={isLoading}
                totalPages={users?.pageInfo?.totalPages ?? 0}
            />
        </div>
    )
}
