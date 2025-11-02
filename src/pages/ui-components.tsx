/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreVerticalIcon } from "lucide-react"
import { toast } from "sonner"

import {  useMemo } from "react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, ButtonWithLoading } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SelectInput } from "@/components/ui/select-input"

import { useDummyPosts } from "@/queries/dummy"



export default function UIComponents() {
    const columns: ColumnDef<Post>[] = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "#",
            },
            {
                accessorKey: "title",
                header: "العنوان",
            },
            {
                accessorKey: "content",
                header: "المحتوى",
            },
            {
                id: "actions",
                header: "الإجراءات",
                cell: () => {
                    return (
                        <DropdownMenu dir="rtl">
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 focus:ring-3 focus:ring-primary/35">
                                    <MoreVerticalIcon className="size-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <AlertDialog>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => toast("اهلا بك")}>عرض</DropdownMenuItem>
                                    <DropdownMenuItem>تعديل</DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <AlertDialogTrigger className="w-full text-red-500 font-semibold hover:bg-red-50 focus:bg-red-50">
                                            حذف
                                        </AlertDialogTrigger>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-destructive">تأكيد الحذف</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء. سيتم حذف
                                            المنتج بشكل دائم من النظام.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction>حذف</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenu>
                    )
                },
            },
        ],
        []
    )
    // Get posts from dummy API
    const { data: posts = [], isLoading } = useDummyPosts()



    return (
        <div className="container py-10">
            <DataTable columns={columns} data={posts} loading={isLoading} totalPages={10} />

            <Dialog>
                <DialogTrigger className="mt-10" asChild>
                    <Button>Open</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>تأكيد الحذف</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء. سيتم حذف المنتج بشكل دائم من
                            النظام.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <ButtonWithLoading size="lg" className="flex mt-10" loading={true}>
                حذف
            </ButtonWithLoading>

            <SelectInput
                className="mt-2"
                placeholder="اختر ..."
                options={[
                    { label: "المنتج الأول", value: "المنتج الأول" },
                    { label: "المنتج الثاني", value: "المنتج الثاني" },
                    { label: "المنتج الثالث", value: "المنتج الثالث" },
                    { label: "المنتج الرابع", value: "المنتج الرابع" },
                    { label: "المنتج الخامس", value: "المنتج الخامس" },
                ]}
                noOptionsMessage="لا يوجد خيارات"
                isLoading
                isSearchable
                isMulti
            />
        </div>
    )
}
