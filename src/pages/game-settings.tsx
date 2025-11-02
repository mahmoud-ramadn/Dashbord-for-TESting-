/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit } from "lucide-react"

import { useState } from "react"

import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Loader from "@/components/ui/loader"

import GameSettingsForm from "@/components/forms/game-settings"
import PermissionsRender from "@/components/permissions/render"
import { useGameSettings } from "@/hooks/game-settings"

export default function GameSettings() {
    const { value: settings, loading, retry } = useGameSettings()
    const [open, setOpen] = useState(false)

    const settingsConfig = [
        {
            key: "easyPoints",
            label: "نقاط المستوى السهل",
            icon: "🟢",
        },
        {
            key: "mediumPoints",
            label: "نقاط المستوى المتوسط",
            icon: "🟡",
        },
        {
            key: "hardPoints",
            label: "نقاط المستوى الصعب",
            icon: "🔴",
        },
        {
            key: "timePerQuestionSeconds",
            label: "الوقت لكل سؤال (ثانية)",
            icon: "⏱️",
        },
        {
            key: "timeExtensionSeconds",
            label: "وقت التمديد (ثانية)",
            icon: "⏰",
        },
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="container ">
                <div className="flex items-center justify-between mb-8 py-10">
                    <h1 className="text-3xl font-bold tracking-tight" dir="rtl">
                        إعدادات اللعبة
                    </h1>
                    <PermissionsRender
                        businessModule={PermissionsBusinessModule.SETTINGS}
                        permissions={[PermissionEnum.UPDATE]}
                    >
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="lg" className="w-max cursor-pointer">
                                تعديل
                                <Edit className="size-4 ml-2" />
                            </Button>
                        </DialogTrigger>
                    </PermissionsRender>

                    <DialogContent className="lg:max-w-6xl">
                        <DialogTitle className="text-center text-xl font-semibold">تعديل اعدادات اللعبة</DialogTitle>

                        <GameSettingsForm values={settings} retry={retry} closeDialog={() => setOpen(false)} />
                    </DialogContent>
                </div>

                <div className="bg-white rounded-xl  border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center">
                            <Loader className=" size-10" />
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {settingsConfig.map((config) => (
                                <div key={config.key} className="p-6 hover:bg-gray-50 transition-colors" dir="rtl">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="text-2xl">{config.icon}</span>
                                            <label className="text-lg font-medium text-gray-900">{config.label}</label>
                                        </div>
                                        <div className="px-6 py-2 bg-gray-100 rounded-lg">
                                            <span className="text-2xl font-bold text-gray-900">
                                                {(settings as any)?.[config.key] ?? 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    )
}
