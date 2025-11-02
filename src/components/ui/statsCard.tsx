import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StatsCardProps {
    title: string
    value: string | number
    change: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    iconColorClassName: string
    trendIcon: "up" | "down"
}

export default function StatsCard({
    title,
    value,
    change,
    icon: Icon,
    iconColorClassName = "",
    trendIcon,
}: Readonly<StatsCardProps>) {
    const TrendIcon = trendIcon === "up" ? TrendingUpIcon : TrendingDownIcon
    const trendIconColorClassName = trendIcon === "up" ? "text-green-600" : "text-red-600"

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-row items-center justify-between pb-4">
                <div className={cn("p-3 rounded-lg bg-opacity-10", iconColorClassName)}>
                    <Icon className={cn("size-10 shrink-0", iconColorClassName)} />
                </div>
                <div className={cn("flex items-center", trendIconColorClassName)}>
                    <TrendIcon className="size-7" />
                    <span className="text-lg font-bold ms-1">{change}</span>
                </div>
            </div>
            <h3 className="text-gray-500 font-medium pt-2">{title}</h3>
            <div className="text-4xl font-bold text-gray-900 mt-2">{value}</div>
        </div>
    )
}
