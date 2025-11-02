import { useAtom } from "jotai"
import { RotateCcw } from "lucide-react"

import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { DEFAULT_PAGE_SIZE } from "@/lib/constants"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

import { queryTableAtom } from "@/atoms"
import { useReportsQueryFilterState } from "@/hooks/reports"
import { useDebouncedInput } from "@/hooks/useDebounceInput"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { SelectInput } from "../ui/select-input"

type StatusOption = { label: string; value: string }
type ReasonOption = { label: string; value: string }

type FilterForm = {
    search: string
    status?: StatusOption | ""
    reason?: ReasonOption | ""
}

const STATUS_OPTIONS: StatusOption[] = [
    { label: "جديد", value: "NEW" },
    { label: "قيد المراجعة", value: "UNDER_REVIEW" },
    { label: "تم الحل", value: "RESOLVED" },
    { label: "مرفوض", value: "DISMISSED" },
]

const REASON_OPTIONS: ReasonOption[] = [
    { label: "الإجابة الصحيحة خاطئة", value: "THE_CORRECT_ANSWER_IS_WRONG" },
    { label: "إجابات صحيحة متعددة", value: "MULTIPLE_CORRECT_ANSWERS" },
    { label: "السؤال غير واضح أو مربك", value: "QUESTION_UNCLEAR_OR_CONFUSING" },
    { label: "خطأ إملائي أو نحوي", value: "SPELLING_OR_GRAMMAR_ERROR" },
    { label: "معلومات قديمة", value: "OUTDATED_INFORMATION" },
    { label: "أخرى", value: "OTHER" },
]

export default function ReportsFilters() {
    const { query, mutate } = useReportsQueryFilterState()
    const [, setQueryTable] = useAtom(queryTableAtom)
    const { value: debouncedSearch, handleChange: handleSearchChange } = useDebouncedInput(300, query.search ?? "")

    const form = useForm<FilterForm>({
        defaultValues: {
            search: query.search ?? "",
            status: query.status ? STATUS_OPTIONS.find((option) => option.value === query.status) : undefined,
            reason: query.reason ? REASON_OPTIONS.find((option) => option.value === query.reason) : undefined,
        },
    })

    useEffect(() => {
        form.setValue("search", debouncedSearch)
    }, [debouncedSearch, form])

    useEffect(() => {
        if (debouncedSearch !== query.search) {
            mutate({ search: debouncedSearch, page: 1 })
        }
    }, [debouncedSearch, query.search, mutate])

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
            status: "",
            reason: "",
        })
        mutate({
            search: "",
            status: "",
            reason: "",
            page: 1,
            limit: DEFAULT_PAGE_SIZE,
        })
    }
    return (
        <div className="my-6 w-full">
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
                                        placeholder="ابحث عن تقرير..."
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
                        name="status"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-52">
                                <FormControl>
                                    <SelectInput
                                        value={field.value as unknown as { label: string; value: string } | undefined}
                                        onChange={(value) => {
                                            field.onChange(value)
                                            const next = value as StatusOption | undefined
                                            mutate({ status: next?.value || "", page: 1 })
                                        }}
                                        placeholder="اختر الحالة"
                                        options={STATUS_OPTIONS}
                                        isClearable
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-60">
                                <FormControl>
                                    <SelectInput
                                        value={field.value as unknown as { label: string; value: string } | undefined}
                                        onChange={(value) => {
                                            field.onChange(value)
                                            const next = value as ReasonOption | undefined
                                            mutate({ reason: next?.value || "", page: 1 })
                                        }}
                                        placeholder="اختر السبب"
                                        options={REASON_OPTIONS}
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
