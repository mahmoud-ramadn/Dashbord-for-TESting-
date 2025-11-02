import { useAtom } from "jotai"

import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { DEFAULT_PAGE_SIZE, UsersState } from "@/lib/constants"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { queryTableAtom } from "@/atoms"
import { useDebouncedInput } from "@/hooks/useDebounceInput"
import { useUsersQueryFilterState } from "@/hooks/users"

import StatusFilterDropdown from "../ui/status-filter-dropdown"

type FilterForm = {
    search: string
    isActive: boolean
}

export default function UsersFilter() {
    const { query, mutate } = useUsersQueryFilterState()
    const [, setQueryTable] = useAtom(queryTableAtom)

    const { value: debouncedSearch, handleChange: handleSearchChange } = useDebouncedInput(300, query.search ?? "")

    const form = useForm<FilterForm>({
        defaultValues: {
            search: query.search ?? "",

            isActive: query.state === UsersState.ACTIVE,
        },
    })

    useEffect(() => {
        form.setValue("search", debouncedSearch)
    }, [debouncedSearch, form])

    useEffect(() => {
        if (debouncedSearch !== query.search) {
            mutate({ search: debouncedSearch, page: 1 })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch])
    useEffect(() => {
        setQueryTable({
            page: query.page ?? 1,
            limit: query.limit ?? DEFAULT_PAGE_SIZE,
        })
    }, [query, setQueryTable])
    const handleResetFilter = () => {
        form.reset({
            isActive: false,
            search: "",
        })
        mutate({
            state: "",
            search: "",
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
                                        placeholder="ابحث بالاسم أو البريد..."
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
                            label="حالة المستخدمين "
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
