import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
// ✅ أضف useSetAtom
import { omit } from "lodash-es"
import { toast } from "sonner"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router"

import { LEVELS, LEVELS_MAP } from "@/lib/constants"

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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SelectInput } from "@/components/ui/select-input"
import { UploadInput } from "@/components/ui/upload-input"

import { createQuestion, updateQuestion } from "@/apis/questions"
import { queryTableAtom } from "@/atoms"
import { type QuestionFormSchema, questionFormSchema } from "@/components/forms/Question/schema"
import { useUpload } from "@/hooks/use-upload"
import { useDebouncedInput } from "@/hooks/useDebounceInput"
import { useCategories } from "@/queries/category"

type Props = {
    isEdit?: boolean
    values?: QuestionResponse | null
    loading?: boolean
}

export default function QuestionForm({ isEdit = false, values, loading = false }: Props) {
    const [queryTable] = useAtom(queryTableAtom)
    const navigate = useNavigate()
    const params = useParams()
    const categoryId = params?.categoryId
    const categoryName = params?.categoryName

    const form = useForm<QuestionFormSchema>({
        resolver: zodResolver(questionFormSchema(!categoryId)),
        values: {
            name: values?.name ?? "",
            answer: values?.answer ?? "",
            level: values?.level ?? LEVELS.EASY,
            category: values?.category?.id
                ? { label: values?.category?.arName, value: values?.category?.id }
                : undefined,
            answerPhoto: values?.answerPhoto ?? undefined,
            photo: values?.photo ?? undefined,
        },
    })

    const getRedirectUrl = () => {
        const params = new URLSearchParams()

        if (categoryId) {
            if (queryTable.page) params.set("page", queryTable.page.toString())
            if (queryTable.limit) params.set("limit", queryTable.limit.toString())
            const queryString = params.toString()
            return `/categories/${categoryId}${queryString ? `?${queryString}` : ""}`
        }

        if (queryTable.page) params.set("page", queryTable.page.toString())
        if (queryTable.limit) params.set("limit", queryTable.limit.toString())
        const queryString = params.toString()
        return queryString ? `/questions?${queryString}` : "/questions"
    }
    const { value, handleChange } = useDebouncedInput()
    const { data: categories, isLoading: isCategoriesLoading } = useCategories(value)

    const categoriesOptions = useMemo(() => {
        return categories?.data?.items?.map((category) => ({
            label: category?.arName,
            value: category?.id,
        }))
    }, [categories])

    const photoValue = form.watch("photo")
    const nameValue = form.watch("name")
    const answerValue = form.watch("answer")
    const answerImgValue = form.watch("answerPhoto")

    useEffect(() => {
        if (form.formState.isDirty) {
            form.trigger()
        }
    }, [nameValue, answerValue, photoValue, answerImgValue, form, form.formState.isDirty])

    const { url: answerUrl, loading: onLoading } = useUpload(
        answerImgValue instanceof File ? answerImgValue : undefined
    )
    const { url, loading: isUploading } = useUpload(photoValue instanceof File ? photoValue : undefined)

    async function onSubmit(inputs: QuestionFormSchema) {
        try {
            let response

            const inputsWithoutPhoto = omit(inputs, "photo", "category", "answerPhoto")

            const answerImageInputValue =
                typeof answerImgValue === "string" ? answerImgValue : answerImgValue && answerUrl ? answerUrl : null
            const photoInputValue = typeof photoValue === "string" ? photoValue : photoValue && url ? url : null

            const currentCategoryId = categoryId ? categoryId : (inputs?.category?.value ?? "")

            if (isEdit && values?.id) {
                response = await updateQuestion(values?.id, {
                    ...inputsWithoutPhoto,
                    name: inputsWithoutPhoto?.name ? inputsWithoutPhoto?.name : null,
                    answer: inputsWithoutPhoto?.answer ? inputsWithoutPhoto?.answer : null,
                    categoryId: currentCategoryId,
                    answerPhoto: answerImageInputValue,
                    photo: photoInputValue,
                })
            }

            if (!isEdit) {
                response = await createQuestion({
                    ...inputsWithoutPhoto,
                    name: inputsWithoutPhoto?.name ? inputsWithoutPhoto?.name : null,
                    answer: inputsWithoutPhoto?.answer ? inputsWithoutPhoto?.answer : null,
                    categoryId: currentCategoryId,
                    answerPhoto: answerImageInputValue,
                    photo: photoInputValue,
                })
            }

            toast.success(response?.message)
            navigate(getRedirectUrl())
        } catch (error) {
            console.error(error)
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    const breadcrumbLink = isEdit ? `/questions/update/${values?.id}` : "/questions/create"
    const title = (isEdit ? "تعديل" : "إنشاء") + " سؤال"

    return (
        <div>
            {categoryName && <h1 className="text-2xl font-semibold">تصنيف ({categoryName})</h1>}
            <h2 className="text-2xl font-semibold mt-6">{title}</h2>

            <Breadcrumb className="mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/questions">الأسئلة</Link>
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
                                        <FormLabel>السؤال</FormLabel>
                                        <FormControl>
                                            <Input placeholder="السؤال" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الإجابة</FormLabel>
                                        <FormControl>
                                            <Input placeholder="الاسم الانجليزي" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className=" w-full  items-start  gap-4  justify-between flex md:flex-row flex-col  md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="photo"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className=" md:basis-1/2  w-full">
                                                <FormLabel>صورة السؤال</FormLabel>
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
                                    name="answerPhoto"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className=" md:basis-1/2 w-full">
                                                <FormLabel>صورة الاجابة</FormLabel>
                                                <FormControl>
                                                    <UploadInput
                                                        value={answerImgValue}
                                                        onChangeValue={(value) => {
                                                            const currentValue = value?.[0]?.file
                                                            field.onChange(currentValue)
                                                        }}
                                                        loading={onLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>

                            {!categoryId && (
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>التصنيف</FormLabel>
                                            <FormControl>
                                                <SelectInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="اختر التصنيف"
                                                    options={categoriesOptions}
                                                    ariaInvalid={!!form.formState.errors.category}
                                                    noOptionsMessage="لا يوجد تصنيفات"
                                                    isLoading={isCategoriesLoading}
                                                    onInputChange={handleChange}
                                                    isSearchable
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="level"
                                render={({ field }) => (
                                    <FormItem className="col-span-full">
                                        <FormLabel>المستوى</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                dir="rtl"
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="flex gap-x-6 gap-y-2 flex-wrap group"
                                            >
                                                <div className="flex items-center gap-x-2">
                                                    <RadioGroupItem
                                                        value={LEVELS.EASY}
                                                        id="r1"
                                                        className="size-6 [&_svg]:size-4 group-aria-invalid:border-destructive"
                                                    />
                                                    <Label htmlFor="r1" className="text-lg">
                                                        {LEVELS_MAP[LEVELS.EASY]}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center gap-x-2">
                                                    <RadioGroupItem
                                                        value={LEVELS.MEDIUM}
                                                        id="r2"
                                                        className="size-6 [&_svg]:size-4 group-aria-invalid:border-destructive"
                                                    />
                                                    <Label htmlFor="r2" className="text-lg">
                                                        {LEVELS_MAP[LEVELS.MEDIUM]}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center gap-x-2">
                                                    <RadioGroupItem
                                                        value={LEVELS.HARD}
                                                        id="r3"
                                                        className="size-6 [&_svg]:size-4 group-aria-invalid:border-destructive"
                                                    />
                                                    <Label htmlFor="r3" className="text-lg">
                                                        {LEVELS_MAP[LEVELS.HARD]}
                                                    </Label>
                                                </div>
                                            </RadioGroup>
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
                            {isEdit ? "تعديل" : "إنشاء"} سؤال
                        </ButtonWithLoading>
                    </form>
                </FormLoading>
            </Form>
        </div>
    )
}
