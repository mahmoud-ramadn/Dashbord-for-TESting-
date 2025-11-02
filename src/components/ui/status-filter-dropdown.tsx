import { Filter, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StatusFilterDropdownProps {
    value: string
    onValueChange: (value: string) => void
    onReset: () => void
    label?: string
    activeLabel?: string
    inactiveLabel?: string
    allLabel?: string
}

export default function StatusFilterDropdown({
    value,
    onValueChange,
    onReset,
    label = "حالة الفلترة",
    activeLabel = "مفعل",
    inactiveLabel = "معطل",
    allLabel = "الكل",
}: StatusFilterDropdownProps) {
    const getDisplayLabel = () => {
        if (value === "ACTIVE") return activeLabel
        if (value === "INACTIVE") return inactiveLabel
        return allLabel
    }

    return (
        <div className="flex items-center gap-3">
            <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild className=" w-50 h-12">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="size-4" />
                        {label}: {getDisplayLabel()}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
                        <DropdownMenuRadioItem value="">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-blue-500" />
                                {allLabel}
                            </div>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="ACTIVE">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-green-500" />
                                {activeLabel}
                            </div>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="INACTIVE">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-gray-400" />
                                {inactiveLabel}
                            </div>
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:block  w-px bg-border" />

            <Button
                type="button"
                variant="outline"
                size="default"
                onClick={onReset}
                className="flex items-center h-12 gap-2 whitespace-nowrap"
            >
                <RotateCcw className="size-4" />
                إعادة تعيين
            </Button>
        </div>
    )
}
