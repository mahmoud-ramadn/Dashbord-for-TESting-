import { onMessage } from "firebase/messaging"
import { ActivityIcon, PackageIcon, UsersIcon } from "lucide-react"
import { toast } from "sonner"

import { useEffect } from "react"

import StatsCard, { type StatsCardProps } from "@/components/ui/statsCard"

import { generateToken, messaging } from "@/notifications/firebase"

const statsData: StatsCardProps[] = [
    {
        title: "عدد المستخدمين",
        value: "12,345",
        change: "+80%",
        icon: UsersIcon,
        iconColorClassName: "text-blue-500",
        trendIcon: "up",
    },
    {
        title: "المستخدمين الفاعلين",
        value: "1,234",
        change: "+98%",
        icon: ActivityIcon,
        iconColorClassName: "text-green-500",
        trendIcon: "up",
    },
    {
        title: "الباقات الاكثر مبيع",
        value: "24",
        change: "+60%",
        icon: PackageIcon,
        iconColorClassName: "text-yellow-500",
        trendIcon: "up",
    },
]

export default function Index() {
    useEffect(() => {
        generateToken(undefined) // Generate token without service worker registration
        onMessage(messaging, (payload) => {
            toast.success(`اشعار جديد: ${payload.notification?.title} - ${payload.notification?.body}`)
        })
    }, [])
    
    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <h1 className="text-3xl sm:text-4xl font-bold  my-10">الإحصائيات</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statsData.map((item, index) => (
                        <StatsCard key={index} {...item} />
                    ))}
                </div>
            </div>
        </div>
    )
}
