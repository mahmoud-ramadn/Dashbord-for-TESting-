import { type ControlProps, type GroupBase } from "react-select"

import { cn } from "@/lib/utils"

import { type LabelValueType } from "@/components/ui/select-input/custom-components"

export const syncCustomClasses = {
    control: ({ isFocused, selectProps }: ControlProps<LabelValueType, boolean, GroupBase<LabelValueType>>) => {
        const ariaInvalid = !!selectProps?.["aria-invalid"]

        return cn(
            "h-12 rounded-lg border border-border px-3 transition-all duration-200 outline-none text-sm",
            isFocused && "border-primary ring-[3px] ring-primary/50",
            isFocused && ariaInvalid && "ring-destructive/20 border-destructive",
            ((selectProps?.value && !Array.isArray(selectProps?.value)) ||
                (Array.isArray(selectProps?.value) && selectProps?.value?.length > 0)) &&
                "bg-primary/10",
            ariaInvalid && !isFocused && "ring-destructive/20  border-destructive bg-transparent"
        )
    },
    menu: () => {
        return cn(
            "mt-1 !z-50 max-h-60 min-w-[8rem] overflow-hidden rounded border border-border bg-background shadow-xl shadow-primary/10 p-2 animate-in fade-in-0 duration-200 zoom-in-95 overflow-auto"
        )
    },
    option: () => {
        return cn("rounded p-2 !text-sm hover:bg-primary/10")
    },
    placeholder: () => cn("text-muted-foreground text-sm"),
    multiValue: () =>
        cn(
            "rounded-sm bg-white border border-border text-sm font-semibold text-border inline-flex items-center capitalize"
        ),
    multiValueLabel: () => "px-2 py-1",
    multiValueRemove: () =>
        "inline-flex bg-destructive/10 w-7 h-full shrink-0 [&_svg]:size-5 items-center justify-center text-destructive",
    loadingIndicator: () => "text-secondary",
}
