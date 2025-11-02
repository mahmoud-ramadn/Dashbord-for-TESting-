import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { toast } from "sonner"

import { Suspense, lazy } from "react"
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

import { createRole, updateRole } from "@/apis/roles"
import { queryTableAtom } from "@/atoms"
import { roleTransform } from "@/components/forms/role/index.transform"
import { type RoleFormSchema, roleFormSchema } from "@/components/forms/role/schema"
import { revalidateRoles } from "@/queries/role"

const RoleModal = lazy(() => import("@/components/forms/role/modal"))

type Props = {
    isEdit?: boolean
    values?: RoleResponse | null
    loading?: boolean
}

export default function RoleForm({ isEdit = false, values, loading = false }: Props) {
    const [queryTable] = useAtom(queryTableAtom)

    const form = useForm<RoleFormSchema>({
        resolver: zodResolver(roleFormSchema),
        values: {
            name: values?.name ?? "",
            description: values?.description ?? "",
            permissions: [],
        },
    })

    const getRedirectUrl = () => {
        const params = new URLSearchParams()

        if (queryTable.page) params.set("page", queryTable.page.toString())
        if (queryTable.limit) params.set("limit", queryTable.limit.toString())
        const queryString = params.toString()
        return `/roles?${queryString}`
    }

    const navigate = useNavigate()

    async function onSubmit(inputs: RoleFormSchema) {
        try {
            let response

            if (isEdit && values?.id) {
                response = await updateRole(values?.id, roleTransform(inputs))
            }

            if (!isEdit) {
                response = await createRole(roleTransform(inputs))
            }

            // revalidate roles from cache
            revalidateRoles()

            toast.success(response?.message)
            navigate(getRedirectUrl())
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    const breadcrumbLink = isEdit ? `/roles/update/${values?.id}` : "/roles/create"
    const title = (isEdit ? "تعديل" : "إنشاء") + " أدوار"

    return (
        <div>
            <h2 className="text-2xl font-semibold">{title}</h2>

            <Breadcrumb className="mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/roles">الأدوار</Link>
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
                        <div className="grid md:grid-cols-2 items-start gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الاسم</FormLabel>
                                        <FormControl>
                                            <Input placeholder="الاسم" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Suspense
                                fallback={
                                    <div className="mt-2 w-max cursor-not-allowed py-3 px-6 bg-secondary rounded-xl col-span-2">
                                        جاري التحميل...
                                    </div>
                                }
                            >
                                <RoleModal key={values?.id || "new"} className="col-span-2 mt-2" values={values} />
                            </Suspense>

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
                            disabled={form?.formState?.isSubmitting}
                            loading={form?.formState?.isSubmitting}
                        >
                            {isEdit ? "تعديل" : "إنشاء"} أدوار
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
