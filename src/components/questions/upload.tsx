import { UploadIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@/lib/utils"

import { ButtonWithLoading } from "@/components/ui/button"

import { useUpload } from "@/hooks/use-upload"

type Props = {
    className?: string
    onUploadComplete?: () => void
    categoryId?: string
}

export default function QuestionUpload({ className, categoryId }: Readonly<Props>) {
    const [file, setFile] = useState<File | null>(null)
    const { loading } = useUpload(file, {
        type: "questions",
        categoryId,
    })

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        e.target.value = ""

        setFile(file)
    }

    return (
        <div className={cn("", className)}>
            <ButtonWithLoading size="lg" loading={loading} asChild>
                <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                    <UploadIcon className="size-5" />
                    قم برفع الأسئلة
                </label>
            </ButtonWithLoading>
            <input type="file" id="file-upload" className="hidden" onChange={onFileChange} />
        </div>
    )
}
