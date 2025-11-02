import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { omit } from "lodash-es"
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
import { UploadInput } from "@/components/ui/upload-input"

import { createPackage, updatePackage } from "@/apis/packages"
import { queryTableAtom } from "@/atoms"
import { useUpload } from "@/hooks/use-upload"

import { PackageFormSchema, type PackageFormSchemaType } from "./shema"

type Props = {
    isEdit?: boolean
    values?: CreatePackageInputs | null
    loading?: boolean
}

export default function PackagesForm({ isEdit = false, values, loading = false }: Props) {
    const [queryTable] = useAtom(queryTableAtom)

    const form = useForm<PackageFormSchemaType>({
        resolver: zodResolver(PackageFormSchema),
        values: {
            arName: values?.arName ?? "",
            enName: values?.enName ?? "",
            photo: values?.photo ?? undefined,
            price: values?.price ?? 0,
            games: values?.games ?? 0,
            description: values?.description ?? "",
            discountPercentage: values?.discountPercentage ?? 0,
        },
    })
    const getRedirectUrl = () => {
        const params = new URLSearchParams()

        if (queryTable.page) params.set("page", queryTable.page.toString())
        if (queryTable.limit) params.set("limit", queryTable.limit.toString())
        const queryString = params.toString()
        return `/packages?${queryString}`
    }

    const navigate = useNavigate()

    const photoValue = form.watch("photo")

    const { url, loading: isUploading } = useUpload(photoValue instanceof File ? photoValue : undefined)

    async function onSubmit(inputs: PackageFormSchemaType) {
        try {
            const inputsWithoutPhoto = omit(inputs, "photo")
            const photoInputValue = typeof photoValue === "string" ? photoValue : url ? url : null

            const payload = {
                ...inputsWithoutPhoto,
                photo: photoInputValue,
            }
            let response
            if (isEdit && values?.id) {
                response = await updatePackage(values?.id, payload as CreatePackageInputs)
                toast.success("تم تعديل الباقة بنجاح")
            } else {
                response = await createPackage(payload as CreatePackageInputs)
                toast.success(response?.message)
            }

            navigate(getRedirectUrl())
        } catch (error) {
            console.error("Error submitting form:", error)
            const errorMessage = (error as ErrorResponse)?.data?.message || "حدث خطأ أثناء العملية"
            toast.error(errorMessage)
        }
    }

    const breadcrumbLink = isEdit ? `/packages/update/${values?.id}` : "/packages/create"
    const title = (isEdit ? "تعديل" : "إنشاء") + " الباقة"

    return (
        <div>
            <h2 className="text-2xl font-semibold mt-6">{title}</h2>

            <Breadcrumb className="mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/packages">الباقات</Link>
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
                                name="arName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>اسم الباقة عربي</FormLabel>
                                        <FormControl>
                                            <Input placeholder="اسم الباقة عربي" {...field} />
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
                                        <FormLabel>اسم الباقة الانجليزي</FormLabel>
                                        <FormControl>
                                            <Input placeholder="الاسم الانجليزي" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>السعر</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="السعر" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="games"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>عدد الألعاب</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="عدد الألعاب" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discountPercentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الخصم</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="الخصم" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="photo"
                                render={({ field }) => {
                                    return (
                                        <FormItem className=" col-span-full">
                                            <FormLabel>صورة الباقة</FormLabel>
                                            <FormControl>
                                                <UploadInput
                                                    value={photoValue}
                                                    onChangeValue={(value) => {
                                                        const currentValue = value?.[0]?.file
                                                        field.onChange(currentValue)
                                                    }}
                                                    loading={isUploading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
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
                            disabled={isUploading}
                            loading={form?.formState?.isSubmitting}
                        >
                            {isEdit ? "تعديل" : "إنشاء"} باقة
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
