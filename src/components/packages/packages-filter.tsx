/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from "jotai"

import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { GamePackageSortFieldsEnum, GamePackageState } from "@/lib/packages"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectInput } from "@/components/ui/select-input"

import { queryTableAtom } from "@/atoms"
import { usePackagesQueryFilterState } from "@/hooks/packages"
import { useDebouncedInput } from "@/hooks/useDebounceInput"

import StatusFilterDropdown from "../ui/status-filter-dropdown"

type SortOption = { label: string; value: GamePackageSortFieldsEnum }
type OrderOption = { label: string; value: "asc" | "desc" }

type FilterForm = {
    search: string
    sortBy?: SortOption | ""
    order?: OrderOption | ""
    isActive: boolean
}

const SORT_OPTIONS: SortOption[] = [
    { label: "تاريخ الإنشاء", value: GamePackageSortFieldsEnum.CREATED_AT },
    { label: "مرات الشراء", value: GamePackageSortFieldsEnum.PAID_COUNT },
    { label: "الخصم", value: GamePackageSortFieldsEnum.DISCOUNT_PERCENTAGE },
    { label: "عدد الألعاب", value: GamePackageSortFieldsEnum.GAMES },
    { label: "الاسم بالعربية", value: GamePackageSortFieldsEnum.AR_NAME },
    { label: "الاسم بالإنجليزية", value: GamePackageSortFieldsEnum.EN_NAME },
]

const ORDER_OPTIONS: OrderOption[] = [
    { label: "تصاعدي", value: "asc" },
    { label: "تنازلي", value: "desc" },
]

export default function PackagesFilter() {
    const { query, mutate } = usePackagesQueryFilterState()
    const [, setQueryTable] = useAtom(queryTableAtom)

    const { value: debouncedSearch, handleChange: handleSearchChange } = useDebouncedInput(300, query.search ?? "")

    const form = useForm<FilterForm>({
        defaultValues: {
            search: query.search ?? "",
            sortBy: query.sortBy ? SORT_OPTIONS.find((option) => option.value === query.sortBy) : undefined,
            order: query.order ? ORDER_OPTIONS.find((option) => option.value === query.order) : undefined,
            isActive: query.state === GamePackageState.ACTIVE,
        },
    })

    useEffect(() => {
        form.setValue("search", debouncedSearch)
    }, [debouncedSearch, form])

    useEffect(() => {
        if (debouncedSearch !== query.search) {
            mutate({ search: debouncedSearch, page: 1 })
        }
    }, [debouncedSearch])

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
            sortBy: "",
            order: "",
            isActive: false,
        })
        mutate({
            search: "",
            sortBy: "",
            order: "",
            state: "",
            page: 1,
            limit: DEFAULT_PAGE_SIZE,
        })
    }

    return (
        <div className="mb-6 w-full">
            <Form {...form}>
                <form className="flex flex-col items-center md:flex-row md:items-center gap-4 w-full">
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-80">
                                <FormControl>
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="ابحث عن باقة بالاسم..."
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            handleSearchChange(e.target.value)
                                        }}
                                        className="text-base bg-background/50 border-border/60 transition-all"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sortBy"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-52">
                                <FormControl>
                                    <SelectInput
                                        value={field.value as unknown as { label: string; value: string } | undefined}
                                        onChange={(value) => {
                                            field.onChange(value)
                                            const next = value as SortOption | undefined
                                            mutate({ sortBy: next?.value || "", page: 1 })
                                        }}
                                        placeholder="اختر الترتيب"
                                        options={SORT_OPTIONS}
                                        isClearable
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-52">
                                <FormControl>
                                    <SelectInput
                                        value={field.value as unknown as { label: string; value: string } | undefined}
                                        onChange={(value) => {
                                            field.onChange(value)
                                            const next = value as OrderOption | undefined
                                            mutate({ order: next?.value || "", page: 1 })
                                        }}
                                        placeholder="اختر الاتجاه"
                                        options={ORDER_OPTIONS}
                                        isClearable
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center md:w-fit w-full  gap-3">
                        <StatusFilterDropdown
                            value={query.state || ""}
                            onValueChange={(value) => {
                                mutate({
                                    state: value,
                                    page: 1,
                                })
                            }}
                            onReset={handleResetFilter}
                            label="حالة الباقات"
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
