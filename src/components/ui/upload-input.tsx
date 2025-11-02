"use client"

import { uniqueId } from "lodash-es"
import { CheckIcon, ImageIcon, Trash2Icon } from "lucide-react"

import * as React from "react"

import { areAllValidFiles, isImageType, readFileAsDataURL } from "@/lib/file"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/loader"
import { Skeleton } from "@/components/ui/skeleton"

type ValueType = string[] | string | File | File[]

export type PreviewType = {
    id: string
    name?: string
    file: File | string
    url: string
    type?: "image" | "file"
    size?: number
}

type Props = Omit<React.ComponentProps<"input">, "type" | "value"> & {
    value?: ValueType
    placeholder?: string
    type?: "image" | "file"
    loading?: boolean
    disabled?: boolean
    onChangeValue?: (value: PreviewType[]) => void
    onDelete?: (value: number) => void
}

/**
 * Creates a preview object from a given URL link.
 * @param {string} link - The URL of the file to create a preview for.
 * @returns {PreviewType} An object containing preview information derived from the link.
 */
const createPreviewFromLink = (link: string): PreviewType => {
    const name = link?.split("/").pop() || ""

    return {
        id: uniqueId(),
        name,
        file: link,
        url: link,
        type: "image",
        size: undefined,
    }
}

/**
 * Maps a file item to an object with additional metadata.
 *
 * @param {File} file - The file to be processed.
 * @returns {Promise<Object>} A promise that resolves to an object containing metadata about the file.
 * @throws {Error} If an error occurs during file processing.
 */
const mapFilesItem = async (file: File): Promise<PreviewType> => {
    try {
        // Initialize the URL for the file (empty by default)
        let url = ""

        // Check if the file is an image
        const isImage = isImageType(file)

        // If it's an image, read its content as a data URL
        if (isImage) {
            url = await readFileAsDataURL(file)
        }

        // Return the mapped file object
        return {
            id: uniqueId(), // Unique identifier for the file
            name: file.name, // Original name of the file
            file, // The file object
            url, // URL for the file (data URL if image)
            type: isImage ? "image" : "file", // File type
            size: file.size, // File size in bytes
        }
    } catch (err) {
        console.error("Error mapping file item:", err)
        throw err // Re-throw the error for further handling
    }
}

/**
 * Maps a FileList to an array of PreviewType objects, converting image files to Data URLs.
 * @param {FileList} files - The list of files to map.
 * @returns {Promise<PreviewType[]>} A promise that resolves to an array of PreviewType objects.
 */
const mapFilesToPreviews = async (files: FileList): Promise<PreviewType[]> => {
    const promises = Array.from(files).map(mapFilesItem)
    return Promise.all(promises) as Promise<PreviewType[]>
}

const UploadInput = React.forwardRef<HTMLInputElement, Props>(
    (
        {
            className,
            placeholder,
            type = "image",
            onChangeValue,
            value,
            onDelete,
            loading = false,
            disabled = false,
            ...props
        },
        ref
    ) => {
        const { id, multiple, ...rest } = props
        const [isDragging, setIsDragging] = React.useState(false)
        const [previews, setPreviews] = React.useState<PreviewType[]>([])

        /**
         * The current placeholder text for the upload input.
         * If a custom placeholder is provided, it is used. Otherwise, a default placeholder is used.
         * The default placeholder is a translated string that says "Choose an image or drag & drop it here".
         * @type {string}
         */
        const currentPlaceholder = placeholder ? placeholder : "اختر صورة أو اسحب وأفلتها هنا"

        /**
         * Maps the selected files to preview objects and updates the state accordingly.
         * If the multiple flag is set to true, the new previews are appended to the existing previews.
         * Otherwise, the new previews replace the existing ones. The onChange callback is also notified.
         * @param {FileList} files - The list of files to map to preview objects.
         */
        const onChangeMapFiles = async (files: FileList) => {
            try {
                const isValidFiles = areAllValidFiles(files, type)

                if (!isValidFiles) {
                    return
                }

                const newPreviews = await mapFilesToPreviews(files)
                const updatedPreviews = multiple ? [...newPreviews, ...previews] : newPreviews

                setPreviews(updatedPreviews)
                onChangeValue?.(updatedPreviews)
            } catch (err) {
                console.error(err)
            }
        }

        /**
         * Handles the file value by mapping it to a preview object and updating the state.
         * If the current value is undefined, it does not update the previews state.
         * @param {File} file - The file to be mapped to a preview object.
         */
        const handleFileValue = React.useCallback(
            async (file: File) => {
                const preview = await mapFilesItem(file)
                if (!value) return
                setPreviews([preview])
            },
            [value]
        )

        /**
         * Handles the change event for the file input, mapping selected files to preview objects.
         * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
         */
        const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            // Retrieve the files from the event target
            const currentValue = e?.target?.files

            // If no files are selected, exit early
            if (!currentValue?.length) return

            await onChangeMapFiles(currentValue)

            // Clear the input value to allow for immediate re-selection of the same files
            e.target.value = ""
        }

        /**
         * Handles the drop event on the label element, processing the dropped files.
         * Prevents the default event behavior, stops event propagation, and sets the isDragging state to false.
         * If files are dropped, it maps them to preview objects and updates the state.
         * @param {React.DragEvent<HTMLLabelElement>} e - The drop event.
         */
        const onDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)

            const files = e.dataTransfer.files
            if (!files.length) return

            await onChangeMapFiles(files)
        }

        /**
         * Handles the drag over event on the label element, indicating that a file is being dragged over the drop zone.
         * Prevents the default event behavior and sets the isDragging state to true.
         * @param {React.DragEvent<HTMLLabelElement>} e - The drag over event.
         */
        const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault()
            setIsDragging(true)
        }

        /**
         * Handles the drag leave event on the label element, indicating that a file is no longer being dragged over the drop zone.
         * Sets the isDragging state to false.
         */
        const onDragLeave = () => {
            setIsDragging(false)
        }

        /**
         * Resets the previews state to an empty array and notifies the onChange callback.
         */
        const onResetPreviews = () => {
            setPreviews([])
            onChangeValue?.([])
        }

        // Function to handle string value
        const handleStringValue = (link: string) => {
            const preview = createPreviewFromLink(link)
            setPreviews([preview])
        }

        /**
         * Executes the deletion action and resets the previews state.
         * Calls the onDelete callback with an argument of 0, indicating the first preview to be deleted.
         * Then, it calls onResetPreviews to clear the previews state and notify the onChange callback.
         */
        const onDeleteAction = () => {
            onDelete?.(0)
            onResetPreviews()
        }

        /**
         * Updates the previews state based on the value prop.
         * If the value is a string and the multiple flag is false, it creates a preview from the value and sets it as the only preview.
         */
        React.useEffect(() => {
            if (!multiple && typeof value === "string" && value !== "") {
                handleStringValue(value)
                return
            }

            if (!multiple && value instanceof File) {
                handleFileValue(value)
                return
            }

            if (value === "" || value === null || value === undefined) {
                setPreviews([])
            }
        }, [value, multiple, handleFileValue])

        /**
         * Determines the accept attribute value for the file input based on the type prop.
         * If the type is "image", it sets the accept attribute to "image/*", otherwise, it sets it to undefined.
         * This allows the file input to filter the types of files that can be selected based on the type prop.
         */
        const acceptType = type === "image" ? "image/*" : undefined

        return (
            <div>
                <div className="relative">
                    {loading && <Loader className="absolute -top-6 end-0 size-4 duration-400" />}
                    <label
                        htmlFor={id}
                        className={cn(
                            "group flex cursor-pointer gap-x-3 gap-y-2 rounded border border-dashed border-gray-150 p-4 transition-colors duration-200 hover:border-primary hover:bg-primary/10",
                            (loading || disabled) && "pointer-events-none",
                            !multiple && previews?.length && "sm:pe-14",
                            previews?.length && "border-primary bg-primary/10",
                            isDragging && "border-secondary bg-secondary/10",
                            className
                        )}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        <div className="flex size-16 shrink-0 items-center justify-center rounded bg-gray-450 transition-colors duration-200 group-hover:bg-blue-500/40">
                            {!multiple && previews?.length ? (
                                <img
                                    src={previews[0]?.url}
                                    className="aspect-square w-full object-contain"
                                    width={64}
                                    height={64}
                                    alt="uploader"
                                />
                            ) : (
                                <ImageIcon className="size-10" />
                            )}
                        </div>

                        <div className="flex w-full flex-col flex-wrap gap-x-3 gap-y-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-y-px">
                                <p className="line-clamp-1 break-all font-medium transition-all duration-200 lg:group-hover:translate-y-2.5">
                                    {!multiple && !previews?.length ? currentPlaceholder : previews[0]?.name}
                                </p>
                                <p className="flex items-center gap-x-1.5 text-sm text-gray-150 transition-colors duration-200 lg:group-hover:opacity-0">
                                    {!previews?.length ? (
                                        "JPG, JPEG, and PNG formats, up to 2MB"
                                    ) : (
                                        <>
                                            <CheckIcon width={12} height={12} />
                                            تم تحميل الصورة بنجاح
                                        </>
                                    )}
                                </p>
                            </div>

                            <p
                                className={cn(
                                    "hover:border-gradient-py flex h-10 w-max items-center justify-center rounded-full border border-gray-150 px-4 transition-opacity duration-200",
                                    !previews?.length && "lg:group-hover:opacity-0"
                                )}
                            >
                                {previews?.length ? "تغيير الصورة" : "اختر صورة"}
                            </p>
                        </div>
                    </label>

                    {previews?.length ? (
                        <Button
                            type="button"
                            variant="ghost"
                            className="absolute end-2 top-1/2 -translate-y-1/2 p-3"
                            onClick={onDeleteAction}
                        >
                            <Trash2Icon className="size-5 text-destructive" />
                        </Button>
                    ) : null}
                </div>

                <input
                    ref={ref}
                    id={id}
                    className="hidden"
                    accept={acceptType}
                    {...rest}
                    type="file"
                    onChange={onFileChange}
                    disabled={disabled || loading}
                />
            </div>
        )
    }
)

UploadInput.displayName = "UploadInput"

const UploadInputSkeleton = () => {
    return (
        <div className="flex items-center gap-x-3">
            <Skeleton className="size-20 rounded-full" />
            <div className="flex flex-col gap-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-32" />
            </div>
        </div>
    )
}

export { UploadInput, UploadInputSkeleton }
