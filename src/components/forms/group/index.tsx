import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { toast } from "sonner"

import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ButtonWithLoading } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormLoading, FormMessage } from "@/components/ui/form"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { createGroup, updateGroup } from "@/apis/groups"
import { queryTableAtom } from "@/atoms"
import { type GroupFormSchema, groupFormSchema } from "@/components/forms/group/schema"
import { revalidateGroups } from "@/queries/groups"

type Props = {
    isEdit?: boolean
    values?: GroupResponse | null
    loading?: boolean
}

export default function GroupForm({ isEdit = false, values, loading = false }: Props) {
    const [queryTable] = useAtom(queryTableAtom)

    const form = useForm<GroupFormSchema>({
        resolver: zodResolver(groupFormSchema),
        values: {
            arName: values?.arName ?? "",
            enName: values?.enName ?? "",
            description: values?.description ?? "",
        },
    })

    const getRedirectUrl = () => {
        const params = new URLSearchParams()

        if (queryTable.page) params.set("page", queryTable.page.toString())
        if (queryTable.limit) params.set("limit", queryTable.limit.toString())
        const queryString = params.toString()
        return `/groups?${queryString}`
    }
    const navigate = useNavigate()

    async function onSubmit(inputs: GroupFormSchema) {
        try {
            let response

            if (isEdit && values?.id) {
                response = await updateGroup(values?.id, inputs)
            }

            if (!isEdit) {
                response = await createGroup(inputs)
            }

            revalidateGroups()

            toast.success(response?.message)
            navigate(getRedirectUrl())
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    const breadcrumbLink = isEdit ? `/groups/update/${values?.id}` : "/groups/create"
    const title = (isEdit ? "تعديل" : "إنشاء") + " مجموعة"

    return (
        <div>
            <h2 className="text-2xl font-semibold">{title}</h2>

            <Breadcrumb className="mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/groups">المجموعات</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={breadcrumbLink}>{title}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Form {...form}>
                <FormLoading loading={loading}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
                        <div className="grid md:grid-cols-2 items-start gap-6">
                            <FormField
                                control={form.control}
                                name="arName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الاسم العربي</FormLabel>
                                        <FormControl>
                                            <Input placeholder="الاسم العربي" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="enName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الاسم الانجليزي</FormLabel>
                                        <FormControl>
                                            <Input placeholder="الاسم الانجليزي" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="col-span-full">
                                        <FormLabel>الوصف</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="الوصف" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <ButtonWithLoading
                            type="submit"
                            size="lg"
                            className="mt-6"
                            loading={form?.formState?.isSubmitting}
                        >
                            {isEdit ? "تعديل" : "إنشاء"} مجموعة
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
