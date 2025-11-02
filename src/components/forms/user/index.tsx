import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
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

import { updateUser } from "@/apis/users"
import { createUser } from "@/apis/users"
import { queryTableAtom } from "@/atoms"
import { userTransform } from "@/components/forms/user/index.transform"
import { type UserFormSchema, genderOptions, userFormSchema } from "@/components/forms/user/schema"
import { useDebouncedInput } from "@/hooks/useDebounceInput"
import { useQueryRoles } from "@/queries/role"

type Props = {
    isEdit?: boolean
    values?: User | null
    loading?: boolean
}

export default function UserForm({ isEdit = false, values, loading = false }: Props) {
    const [queryTable] = useAtom(queryTableAtom)

    const form = useForm<UserFormSchema>({
        resolver: zodResolver(userFormSchema(!isEdit)),
        values: {
            name: values?.name ?? "",
            email: values?.userAuthentications?.[0]?.email ?? "",
            phone: values?.phone ?? "",
            gender: values?.gender ? genderOptions.find((gender) => gender.value === values?.gender) : undefined,
            password: "",
            role: values?.roles?.[0]?.id
                ? { label: values?.roles?.[0]?.name, value: values?.roles?.[0]?.id }
                : undefined,
        },
    })

    const { value, handleChange } = useDebouncedInput()

    const { data: roles, isLoading: isRolesLoading } = useQueryRoles(value)

    const rolesOptions = useMemo(() => {
        return roles?.data?.items?.map((role) => ({
            label: role?.name,
            value: role?.id,
        }))
    }, [roles])

    const getRedirectUrl = () => {
        const params = new URLSearchParams()

        if (queryTable.page) params.set("page", queryTable.page.toString())
        if (queryTable.limit) params.set("limit", queryTable.limit.toString())
        const queryString = params.toString()
        return `/users?${queryString}`
    }
    const navigate = useNavigate()

    async function onSubmit(inputs: UserFormSchema) {
        try {
            let response

            if (isEdit && values?.id) {
                response = await updateUser(values?.id, userTransform(inputs))
            }

            if (!isEdit) {
                response = await createUser(userTransform(inputs))
            }

            toast.success(response?.message)
            navigate(getRedirectUrl())
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    const breadcrumbLink = isEdit ? `/users/update/${values?.id}` : "/users/create"
    const title = (isEdit ? "تعديل" : "إنشاء") + " مستخدم"

    return (
        <div>
            <h2 className="text-2xl font-semibold">{title}</h2>

            <Breadcrumb className="mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/users">المستخدمين</Link>
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

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>البريد الإلكتروني</FormLabel>
                                        <FormControl>
                                            <Input placeholder="البريد الإلكتروني" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الدور</FormLabel>
                                        <FormControl>
                                            <SelectInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="اختر الدور"
                                                options={rolesOptions}
                                                ariaInvalid={!!form.formState.errors.role}
                                                noOptionsMessage="لا يوجد دورات"
                                                isLoading={isRolesLoading}
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
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الجنس</FormLabel>
                                        <FormControl>
                                            <SelectInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="اختر الجنس"
                                                options={genderOptions}
                                                ariaInvalid={!!form.formState.errors.gender}
                                                noOptionsMessage="لا يوجد جنسات"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الهاتف</FormLabel>
                                        <FormControl>
                                            <Input placeholder="الهاتف" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>كلمة المرور</FormLabel>
                                        <FormControl>
                                            <Input placeholder="كلمة المرور" {...field} />
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
                            {isEdit ? "تعديل" : "إنشاء"} مستخدم
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
