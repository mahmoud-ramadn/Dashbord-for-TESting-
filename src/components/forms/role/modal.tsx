import { PlusIcon } from "lucide-react"

import { useEffect, useMemo } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

import { roleModalTransform } from "@/components/forms/role/index.transform"
import type { RoleFormSchema } from "@/components/forms/role/schema"
import { usePermissions } from "@/queries/permissions"

type Props = {
    className?: string
    values?: RoleResponse | null
}

export default function RoleModal({ className, values }: Props) {
    const { data: permissions, isLoading: isPermissionsLoading } = usePermissions()

    const {
        control,
        formState: { errors },
        setValue,
        trigger,
    } = useFormContext<RoleFormSchema>()

    const { fields } = useFieldArray({
        control,
        name: "permissions",
    })

    const mappedPermissions = useMemo(() => roleModalTransform(permissions ?? [], values), [permissions, values])

    useEffect(() => {
        if (!mappedPermissions?.length) {
            return
        }

        const timeout = setTimeout(() => {
            setValue("permissions", mappedPermissions)
        }, 0)

        return () => clearTimeout(timeout)
    }, [setValue, mappedPermissions])

    if (isPermissionsLoading) {
        return (
            <div className={cn("mt-2 w-max cursor-not-allowed py-3 px-6 bg-secondary rounded-xl", className)}>
                جاري التحميل...
            </div>
        )
    }

    if (!mappedPermissions?.length) {
        return null
    }

    const errorMessage = errors?.permissions?.root?.message || errors?.permissions?.message

    return (
        <Dialog>
            <div className={cn("", className)}>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="lg" className="w-max cursor-pointer">
                        حدد الصلاحيات
                        <PlusIcon className="size-4" />
                    </Button>
                </DialogTrigger>

                {!!errorMessage && <p className="text-destructive text-sm mt-2">{errorMessage}</p>}
            </div>

            <DialogContent className="lg:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>حدد الصلاحيات</DialogTitle>
                </DialogHeader>
                <DialogDescription>حدد الصلاحيات التي تريد إضافتها إلى الدور</DialogDescription>
                <FormField
                    control={control}
                    name="permissions"
                    render={() => (
                        <FormItem>
                            <div className="flex flex-col gap-y-2" dir="ltr">
                                {fields.map((field, fieldIndex) => {
                                    return (
                                        <div key={field.id} className="mt-6 border border-gray-400 p-5 rounded-xl">
                                            <h2 className="text-lg font-bold text-primary">{field?.businessModule}</h2>
                                            <div className="grid grid-cols-4 gap-4 mt-4">
                                                {field?.permissions?.map((permission, permissionIndex) => {
                                                    return (
                                                        <FormField
                                                            key={permission?.id}
                                                            control={control}
                                                            name={`permissions.${fieldIndex}.permissions.${permissionIndex}.checked`}
                                                            render={({ field: checkboxField }) => (
                                                                <FormItem className="flex items-center gap-2">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={checkboxField?.value}
                                                                            onCheckedChange={(checked) => {
                                                                                checkboxField?.onChange(checked)
                                                                                trigger("permissions")
                                                                            }}
                                                                            className="size-6"
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm text-gray-600">
                                                                        {permission?.value}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </FormItem>
                    )}
                />
            </DialogContent>
        </Dialog>
    )
}
