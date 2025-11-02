import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { omit } from "lodash-es"
import { toast } from "sonner"

import { useMemo } from "react"
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
import { SelectInput } from "@/components/ui/select-input"
import { Textarea } from "@/components/ui/textarea"
import { UploadInput } from "@/components/ui/upload-input"

import { createCategory, updateCategory } from "@/apis/categories"
import { queryTableAtom } from "@/atoms"
import { type CategoryFormSchema, categoryFormSchema } from "@/components/forms/category/schema"
import { useUpload } from "@/hooks/use-upload"
import { useDebouncedInput } from "@/hooks/useDebounceInput"
import { revalidateCategories } from "@/queries/category"
import { useGroups } from "@/queries/groups"

type Props = {
    isEdit?: boolean
    values?: CategoryResponse | null
    loading?: boolean
}

export default function CategoryForm({ isEdit = false, values, loading = false }: Props) {
    const [queryTable] = useAtom(queryTableAtom)

    const form = useForm<CategoryFormSchema>({
        resolver: zodResolver(categoryFormSchema),
        values: {
            arName: values?.arName ?? "",
            enName: values?.enName ?? "",
            description: values?.description ?? "",
            group:
                values?.group?.arName && values?.group?.id
                    ? { label: values?.group?.arName, value: values?.group?.id }
                    : undefined,
            photo: values?.photo ?? undefined,
        },
    })

    const getRedirectUrl = () => {
        const params = new URLSearchParams()

        if (queryTable.page) params.set("page", queryTable.page.toString())
        if (queryTable.limit) params.set("limit", queryTable.limit.toString())
        const queryString = params.toString()
        return `/categories?${queryString}`
    }

    const navigate = useNavigate()

    const { value, handleChange } = useDebouncedInput()
    const { data: groups, isLoading: isGroupsLoading } = useGroups(value)

    const groupsOptions = useMemo(() => {
        return groups?.data?.items?.map((group) => ({
            label: group?.arName,
            value: group?.id,
        }))
    }, [groups])

    const photoValue = form.watch("photo")

    const { url, loading: isUploading } = useUpload(photoValue instanceof File ? photoValue : undefined)

    async function onSubmit(inputs: CategoryFormSchema) {
        try {
            let response

            const inputsWithoutPhoto = omit(inputs, "photo", "group")

            const photoInputValue = typeof photoValue === "string" ? photoValue : url ? url : null

            if (isEdit && values?.id) {
                response = await updateCategory(values?.id, {
                    ...inputsWithoutPhoto,
                    groupId: inputs?.group?.value ?? "",
                    photo: photoInputValue,
                })
            }

            if (!isEdit) {
                response = await createCategory({
                    ...inputsWithoutPhoto,
                    groupId: inputs?.group?.value ?? "",
                    photo: photoInputValue,
                })
            }

            revalidateCategories()

            toast.success(response?.message)
            navigate(getRedirectUrl())
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    const breadcrumbLink = isEdit ? `/categories/update/${values?.id}` : "/categories/create"
    const title = (isEdit ? "تعديل" : "إنشاء") + " تصنيف"

    return (
        <div>
            <h2 className="text-2xl font-semibold">{title}</h2>

            <Breadcrumb className="mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/categories">التصنيفات</Link>
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
                                name="group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>المجموعة</FormLabel>
                                        <FormControl>
                                            <SelectInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="اختر المجموعة"
                                                options={groupsOptions}
                                                ariaInvalid={!!form.formState.errors.group}
                                                noOptionsMessage="لا يوجد مجموعات"
                                                isLoading={isGroupsLoading}
                                                onInputChange={handleChange}
                                                isSearchable
                                            />
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
                                        <FormItem className="col-span-full">
                                            <FormLabel>الصورة</FormLabel>
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
                            {isEdit ? "تعديل" : "إنشاء"} تصنيف
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
