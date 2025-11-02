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

import { createPolicies, updatePolicies } from "@/apis/policies"
import { queryTableAtom } from "@/atoms"
import { type PoliciesFormSchema } from "@/components/forms/policies/schema"

import { policiesFormSchema } from "./schema"

type Props = {
    isEdit?: boolean
    values?: PoliciesResponse | null
    loading?: boolean
}

export default function PoliciesForm({ isEdit = false, values, loading = false }: Props) {
    const [queryTable] = useAtom(queryTableAtom)

    const form = useForm<PoliciesFormSchema>({
        resolver: zodResolver(policiesFormSchema),
        values: {
            arContent: values?.arContent ?? "",
            enContent: values?.enContent ?? "",
        },
    })

    const getRedirectUrl = () => {
        const params = new URLSearchParams()

        if (queryTable.page) params.set("page", queryTable.page.toString())
        if (queryTable.limit) params.set("limit", queryTable.limit.toString())
        const queryString = params.toString()
        return `/policies?${queryString}`
    }

    const navigate = useNavigate()

    async function onSubmit(inputs: PoliciesFormSchema) {
        try {
            let response

            if (isEdit && values?.id) {
                response = await updatePolicies(values?.id, inputs)
            }

            if (!isEdit) {
                response = await createPolicies(inputs)
            }

            toast.success(response?.message)
            navigate(getRedirectUrl())
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    const breadcrumbLink = isEdit ? `/policies/update/${values?.id}` : "/policies/create"
    const title = (isEdit ? "تعديل" : "إنشاء") + " سياسات"

    return (
        <div>
            <h2 className="text-2xl font-semibold">{title}</h2>

            <Breadcrumb className="mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/policies">السياسات</Link>
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
                                name="arContent"
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
                                name="enContent"
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
                        </div>

                        <ButtonWithLoading
                            type="submit"
                            size="lg"
                            className="mt-6"
                            disabled={form?.formState?.isSubmitting}
                            loading={form?.formState?.isSubmitting}
                        >
                            {isEdit ? "تعديل" : "إنشاء"} سياسات
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
