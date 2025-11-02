import { cn } from "@/lib/utils"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ButtonWithLoading } from "@/components/ui/button"

type Props = {
    title: string
    description: string
    onConfirm?: () => void
    open: boolean
    onOpenChange?: (open: boolean) => void
    isLoading?: boolean
    confirmClassName?: string
    titleClassName?: string
}

export default function AppAlertDialog({
    title,
    description,
    onConfirm,
    open,
    onOpenChange,
    isLoading,
    confirmClassName,
    titleClassName,
}: Readonly<Props>) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className={cn("", titleClassName)}>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <ButtonWithLoading className={cn("", confirmClassName)} loading={isLoading} onClick={onConfirm}>
                            تأكيد
                        </ButtonWithLoading>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
