import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            dir="rtl"
            position="top-center"
            toastOptions={{
                classNames: {
                    toast: "group toast !text-border group-[.toaster]:!gap-x-4 justify-center group-[.toaster]:text-base group-[.toaster]:!bg-white group-[.toaster]:!border-border group-[.toaster]:!shadow-blue-500/20 group-[.toaster]:data-[type=success]:!border-green-600 group-[.toaster]:data-[type=success]:!text-green-600 group-[.toaster]:data-[type=error]:!text-red-600 group-[.toaster]:data-[type=error]:!border-red-600 group-[.toaster]:!border-gray-25 group-[.toaster]:data-[type=error]:!shadow-red-500/20 !p-4",
                    title: "group-[.toast]:!font-bold",
                    description: "group-[.toast]:!text-sm",
                    icon: "group-[.toast]:[&>svg]:!size-6",
                    actionButton: "group-[.toast]:!bg-gray-900 group-[.toast]:!text-gray-50",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
