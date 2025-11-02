import type { ColumnDef } from "@tanstack/react-table"
import { MoreVerticalIcon } from "lucide-react"

import { useState } from "react"

import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import { Button } from "@/components/ui/button"
import DataTable from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import ContactUsFilter from "@/components/contact-us/contact-us-filter"
import ReplayForm from "@/components/forms/contact-us-reply"
import PermissionsRender from "@/components/permissions/render"
import { useContactUs } from "@/hooks/contact-us"

export default function ContactUs() {
    const { value: contactUs, loading: isLoading } = useContactUs()
    const [viewOpen, setViewOpen] = useState<boolean>(false)
    const [replyOpen, setReplyOpen] = useState<boolean>(false)
    const [selectedContactUs, setSelectedContactUs] = useState<ContactUsResponse | null>(null)

    const columns: ColumnDef<ContactUsResponse>[] = [
        {
            accessorKey: "name",
            header: "الاسم",
        },
        {
            accessorKey: "email",
            header: "البريد الإلكتروني",
        },
        {
            accessorKey: "messageType",
            header: "نوع الرسالة",
        },

        {
            id: "actions",
            header: "الإجراءات",
            cell: ({ row }) => {
                const contactUs = row?.original

                return (
                    <>
                        <Dialog open={viewOpen && selectedContactUs?.id === contactUs.id} onOpenChange={setViewOpen}>
                            <DropdownMenu dir="rtl">
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 focus:ring-3 focus:ring-primary/35">
                                        <MoreVerticalIcon className="size-6" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    <PermissionsRender
                                        businessModule={PermissionsBusinessModule.CONTACT_US}
                                        permissions={[PermissionEnum.VIEW]}
                                    >
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelectedContactUs(contactUs)
                                                    setViewOpen(true)
                                                }}
                                            >
                                                عرض
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                    </PermissionsRender>

                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedContactUs(contactUs)
                                            setReplyOpen(true)
                                        }}
                                    >
                                        رد
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent className="lg:max-w-2xl">
                                <DialogTitle>عرض الرسالة</DialogTitle>
                                <ScrollArea dir="rtl" className="max-h-[calc(90vh-5rem)] px-6 pb-6">
                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-2">
                                            <DialogTitle>نوع الرسالة</DialogTitle>
                                            <DialogDescription>{contactUs.messageType}</DialogDescription>
                                        </div>

                                        <div className="space-y-2">
                                            <DialogTitle>الرسالة</DialogTitle>
                                            <DialogDescription>{contactUs.message}</DialogDescription>
                                        </div>
                                    </div>
                                </ScrollArea>
                                <ScrollBar orientation="vertical" className="h-3 bg-gray-100 rounded-full" />
                            </DialogContent>
                        </Dialog>

                        <Dialog open={replyOpen && selectedContactUs?.id === contactUs.id} onOpenChange={setReplyOpen}>
                            <DialogContent>
                                <DialogTitle>الرد على الرسالة</DialogTitle>
                                <ReplayForm message={selectedContactUs} closeDialog={setReplyOpen} />
                            </DialogContent>
                        </Dialog>
                    </>
                )
            },
        },
    ]

    return (
        <div className="container space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">الرسائل</h1>

            <ContactUsFilter />

            <DataTable
                columns={columns}
                data={contactUs?.items ?? []}
                loading={isLoading}
                totalPages={contactUs?.pageInfo?.totalPages ?? 0}
            />
        </div>
    )
}
