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

import { createTermsAndConditions, updateTermsAndConditions } from "@/apis/terms-and-conditions"
import { queryTableAtom } from "@/atoms"
import {
    type TermsAndConditionsFormSchema,
    termsAndConditionsFormSchema,
} from "@/components/forms/terms-and-conditions/schema"

type Props = {
    isEdit?: boolean
    values?: TermsAndConditionsResponse | null
    loading?: boolean
}

export default function TermsAndConditionsForm({ isEdit = false, values, loading = false }: Props) {
    const [queryTable] = useAtom(queryTableAtom)

    const form = useForm<TermsAndConditionsFormSchema>({
        resolver: zodResolver(termsAndConditionsFormSchema),
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
        return `/terms-and-conditions?${queryString}`
    }
    const navigate = useNavigate()

    async function onSubmit(inputs: TermsAndConditionsFormSchema) {
        try {
            let response

            if (isEdit && values?.id) {
                response = await updateTermsAndConditions(values?.id, inputs)
            }

            if (!isEdit) {
                response = await createTermsAndConditions(inputs)
            }

            toast.success(response?.message)
            navigate(getRedirectUrl())
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    const breadcrumbLink = isEdit ? `/terms-and-conditions/update/${values?.id}` : "/terms-and-conditions/create"
    const title = (isEdit ? "تعديل" : "إنشاء") + " شروط وأحكام"

    return (
        <div>
            <h2 className="text-2xl font-semibold">{title}</h2>

            <Breadcrumb className="mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/terms-and-conditions">الشروط والأحكام</Link>
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
                            {isEdit ? "تعديل" : "إنشاء"} شروط وأحكام
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
