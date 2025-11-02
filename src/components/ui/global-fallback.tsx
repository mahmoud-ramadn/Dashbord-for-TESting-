import Loader from "@/components/ui/loader"

export default function GlobalFallback() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-50 z-50">
            <Loader />
        </div>
    )
}
