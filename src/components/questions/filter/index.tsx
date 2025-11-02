import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"

import { DEFAULT_PAGE_SIZE, LEVELS_MAP, QuestionsState } from "@/lib/constants"
import { cn } from "@/lib/utils"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectInput } from "@/components/ui/select-input"
import type { LabelValueType } from "@/components/ui/select-input/custom-components"
import StatusFilterDropdown from "@/components/ui/status-filter-dropdown"
import { Switch } from "@/components/ui/switch"

import { queryTableAtom } from "@/atoms"
import { type FilterFormSchema, filterFormSchema } from "@/components/questions/filter/schema"
import { useQuestionsQueryFilterState } from "@/hooks/questions"
import { useDebouncedInput } from "@/hooks/useDebounceInput"
import { useCategories } from "@/queries/category"

type Props = {
    className?: string
    hideCategory?: boolean
}

export default function QuestionsFilter({ className, hideCategory = false }: Readonly<Props>) {
    const { query, mutate } = useQuestionsQueryFilterState()

    const [, setQueryTable] = useAtom(queryTableAtom)

    const form = useForm<FilterFormSchema>({
        resolver: zodResolver(filterFormSchema),
        defaultValues: {
            search: query.search ?? "",
            category:
                query.categoryLabel && query.categoryValue
                    ? { label: query.categoryLabel, value: query.categoryValue }
                    : null,
            level: query.levelLabel && query.levelValue ? { label: query.levelLabel, value: query.levelValue } : null,
            hasComments: query.hasComments ?? false,
            state: query.state === QuestionsState.ACTIVE,
        },
    })

    const { value, handleChange } = useDebouncedInput()
    const { data: categories, isLoading: isCategoriesLoading } = useCategories(value)

    const categoriesOptions = useMemo(() => {
        return categories?.data?.items?.map((category) => ({
            label: category?.arName,
            value: category?.id,
        }))
    }, [categories])

    const {
        value: searchValue,
        handleChange: handleSearchChange,
        setValue: setSearchValue,
    } = useDebouncedInput(300, query.search ?? "")

    useEffect(() => {
        if (query.search !== searchValue) {
            setSearchValue(query.search ?? "")
        }
    }, [query.search, searchValue, setSearchValue])

    useEffect(() => {
        form.setValue("search", searchValue)
    }, [searchValue, form])

    useMemo(() => {
        if (searchValue !== query.search) {
            mutate({ search: searchValue, state: query.state })
        }
    }, [searchValue, query.search, mutate, query.state])

    useEffect(() => {
        setQueryTable({
            page: query.page ?? 1,
            limit: query.limit ?? DEFAULT_PAGE_SIZE,
        })
    }, [query, setQueryTable])

    const handleResetFilter = () => {
        handleSearchChange("")
        form.reset({
            search: "",
            category: null,
            level: null,
            hasComments: false,
            state: false,
        })

        form.setValue("category", null)
        form.setValue("level", null)

        mutate({
            search: "",
            levelLabel: "",
            levelValue: "",
            categoryLabel: "",
            categoryValue: "",
            hasComments: false,
            state: QuestionsState.RESTE,
            page: 1,
            limit: DEFAULT_PAGE_SIZE,
        })
        setQueryTable({
            page: 1,
            limit: DEFAULT_PAGE_SIZE,
        })
    }

    return (
        <div className={cn("", className)}>
            <Form {...form}>
                <form className="flex flex-col items-center md:flex-row md:items-center flex-wrap gap-6 w-full">
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-80">
                                <FormControl>
                                    <Input
                                        placeholder="ابحث عن سؤال"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            handleSearchChange(e.target.value)
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!hideCategory && (
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem className="w-full md:w-52">
                                    <FormControl>
                                        <SelectInput
                                            value={field.value}
                                            onChange={(value) => {
                                                field.onChange(value)
                                                mutate({
                                                    categoryLabel: (value as LabelValueType)?.label ?? "",
                                                    categoryValue: (value as LabelValueType)?.value ?? "",
                                                })
                                            }}
                                            placeholder="اختر التصنيف"
                                            options={categoriesOptions}
                                            noOptionsMessage="لا يوجد تصنيفات"
                                            isLoading={isCategoriesLoading}
                                            onInputChange={handleChange}
                                            isSearchable
                                            isClearable
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
                            <FormItem className="w-full md:w-52">
                                <FormControl>
                                    <SelectInput
                                        value={field.value}
                                        onChange={(value) => {
                                            field.onChange(value)
                                            mutate({
                                                levelLabel: (value as LabelValueType)?.label ?? "",
                                                levelValue: (value as LabelValueType)?.value ?? "",
                                            })
                                        }}
                                        placeholder="اختر المستوى"
                                        options={Object.entries(LEVELS_MAP).map(([key, value]) => ({
                                            label: value,
                                            value: key,
                                        }))}
                                        onInputChange={handleChange}
                                        isClearable
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="hasComments"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-80 flex items-center gap-x-2">
                                <FormLabel className="cursor-pointer">الأسئلة بالتعليقات</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field?.value}
                                        onCheckedChange={(value) => {
                                            field.onChange(value)
                                            mutate({ hasComments: value })
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center w-full gap-3">
                        <StatusFilterDropdown
                            value={query.state || ""}
                            onValueChange={(value) => {
                                mutate({
                                    state: value,
                                    page: 1,
                                })
                            }}
                            onReset={handleResetFilter}
                            label="حالة الاسئلة"
                            activeLabel="نشط"
                            inactiveLabel="غير نشط"
                            allLabel="الكل"
                        />
                    </div>
                </form>
            </Form>
        </div>
    )
}
