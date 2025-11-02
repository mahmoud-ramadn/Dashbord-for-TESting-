/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "sonner"

import { useEffect, useState } from "react"
import { useBus } from "react-bus"

import { uploadFile, uploadQuestions } from "@/apis/upload"

type UploadType = "file" | "questions"

type Options = {
    categoryId?: string
    type?: UploadType
}

export const useUpload = (file: File | null | undefined, options?: Options) => {
    const bus = useBus()

    const { categoryId, type = "file" } = options ?? {}

    const [url, setUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const mutate = async (file: File) => {
        try {
            toast.loading("جارى الان رفع الملفات ...", {
                classNames: {
                    toast: "group-[.toaster]:data-[type=loading]:!bg-secondary group-[.toaster]:data-[type=loading]:!text-secondary-foreground",
                },
            })

            setLoading(true)

            const response =
                type === "file" ? await uploadFile(file) : await uploadQuestions(file, categoryId as string)

            if (!options?.type || options?.type === "file") {
                setUrl(response?.[0]?.relativePath)
            }

            if (type === "questions") {
                // Emit an event to the parent component to retry the questions query
                bus.emit("upload-questions-complete", response)
            }

            toast.dismiss()

            toast.success("تم الرفع بنجاح")
        } catch (error) {
            console.error(error)

            toast.dismiss()

            toast.error("حدث خطأ ما تأكد من الملف")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!file) return

        mutate(file)
    }, [file])

    return { url, loading }
}
