import { X, ZoomIn } from "lucide-react"

import { useState } from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

import { Button } from "./button"

type ImageOverlayProps = {
    src: string
    alt: string
    thumbnailClassName?: string
    overlayClassName?: string
    showZoomIcon?: boolean
}

export default function Module({
    src,
    alt,
    thumbnailClassName = "",
    overlayClassName = "",
    showZoomIcon = true,
}: ImageOverlayProps) {
    const [isOpen, setIsOpen] = useState(false)

    const openOverlay = () => setIsOpen(true)
    const closeOverlay = () => setIsOpen(false)

    return (
        <>
            <div className="relative group flex items-center  cursor-pointer" onClick={openOverlay}>
                <div className="w-fit relative">
                    <img
                        src={src}
                        alt={alt}
                        className={cn(
                            " size-20 rounded-md object-cover border transition-opacity group-hover:opacity-80",
                            thumbnailClassName
                        )}
                    />
                    {showZoomIcon && (
                        <div className="absolute top-1/2  left-1/2 -translate-x-1/2 -translate-y-1/2  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="size-6 text-primary drop-shadow-lg" />
                        </div>
                    )}
                </div>
            </div>

            {isOpen &&
                createPortal(
                    <div
                        className={cn(
                            "fixed inset-0  bg-black/80  flex items-center  justify-center z-50 p-4",
                            overlayClassName
                        )}
                        onClick={closeOverlay}
                    >
                        <Button
                            className="absolute top-4 right-4  p-2   rounded-full bg-red-700 hover:bg-white/20 transition-colors"
                            onClick={closeOverlay}
                        >
                            <X className="size-6 text-white" />
                        </Button>

                        <div
                            className="relative  md:size-1/2 size-3/4 overflow-hidden rounded-lg "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={src} alt={alt} className=" w-full h-full object-contain rounded-lg" />
                        </div>
                    </div>,
                    document.body
                )}
        </>
    )
}
