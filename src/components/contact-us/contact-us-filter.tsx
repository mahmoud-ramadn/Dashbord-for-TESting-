/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from "jotai"
import { RotateCcw } from "lucide-react"

import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"
import { ContactUsSortFieldsEnum } from "@/lib/contact-us"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectInput } from "@/components/ui/select-input"

import { queryTableAtom } from "@/atoms"
import { useContactUsQueryFilterState } from "@/hooks/contact-us"
import { useDebouncedInput } from "@/hooks/useDebounceInput"

import { Button } from "../ui/button"

type SortOption = { label: string; value: ContactUsSortFieldsEnum }
type OrderOption = { label: string; value: "asc" | "desc" }
type MessageTypeOption = { label: string; value: "QUESTION" | "SUGGESTION" | "COMPLAINT" | "OTHER" }

type FilterForm = {
    search: string
    sortBy?: SortOption | ""
    order?: OrderOption | ""
    messageType?: MessageTypeOption | ""
}

const SORT_OPTIONS: SortOption[] = [
    { label: "تاريخ الإنشاء", value: ContactUsSortFieldsEnum.CREATED_AT },
    { label: "البريد الإلكتروني", value: ContactUsSortFieldsEnum.EMAIL },
    { label: "الاسم", value: ContactUsSortFieldsEnum.NAME },
]

const MESSAGE_TYPE_OPTIONS: MessageTypeOption[] = [
    { label: "سؤال", value: "QUESTION" },
    { label: "اقتراح", value: "SUGGESTION" },
    { label: "شكوى", value: "COMPLAINT" },
    { label: "أخرى", value: "OTHER" },
]

const ORDER_OPTIONS: OrderOption[] = [
    { label: "تصاعدي", value: "asc" },
    { label: "تنازلي", value: "desc" },
]

export default function ContactUsFilter() {
    const { query, mutate } = useContactUsQueryFilterState()
    const [, setQueryTable] = useAtom(queryTableAtom)

    const { value: debouncedSearch, handleChange: handleSearchChange } = useDebouncedInput(300, query.search ?? "")

    const form = useForm<FilterForm>({
        defaultValues: {
            search: query.search ?? "",
            sortBy: query.sortBy ? SORT_OPTIONS.find((option) => option.value === query.sortBy) : undefined,
            order: query.order ? ORDER_OPTIONS.find((option) => option.value === query.order) : undefined,
            messageType: query.messageType
                ? MESSAGE_TYPE_OPTIONS.find((option) => option.value === query.messageType)
                : undefined,
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
            messageType: "",
        })
        mutate({
            search: "",
            sortBy: "",
            order: "",
            messageType: "",
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

                    <FormField
                        control={form.control}
                        name="messageType"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-52">
                                <FormControl>
                                    <SelectInput
                                        value={field.value as unknown as { label: string; value: string } | undefined}
                                        onChange={(value) => {
                                            field.onChange(value)
                                            const next = value as MessageTypeOption | undefined
                                            mutate({ messageType: next?.value || "", page: 1 })
                                        }}
                                        placeholder="نوع الرسالة"
                                        options={MESSAGE_TYPE_OPTIONS}
                                        isClearable
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleResetFilter}
                        className="w-full md:w-auto h-12 "
                    >
                        <RotateCcw className="size-4" />
                        إعادة تعيين{" "}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
