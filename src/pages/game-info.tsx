import { Edit } from "lucide-react"

import { useState } from "react"

import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Loader from "@/components/ui/loader"

import GameInfoForm from "@/components/forms/game-info"
import PermissionsRender from "@/components/permissions/render"
import { useGameInfo } from "@/hooks/game-info"

export default function GameInfo() {
    const { value: gameInfo, retry, loading } = useGameInfo()
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="container">
                <div className="  space-y-6 my-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">عن اللعبة</h1>
                    <PermissionsRender
                        businessModule={PermissionsBusinessModule.GAMES}
                        permissions={[PermissionEnum.UPDATE]}
                    >
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="lg" className="w-max cursor-pointer">
                                تعديل
                                <Edit className="size-4 ml-2" />
                            </Button>
                        </DialogTrigger>
                    </PermissionsRender>
                </div>

                <DialogContent className="lg:max-w-6xl">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-semibold">تعديل الوصف</DialogTitle>
                    </DialogHeader>

                    <GameInfoForm values={gameInfo} retry={retry} closeDialog={() => setOpen(false)} />
                </DialogContent>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    {loading ? (
                        <Loader className="size-8 mx-auto" />
                    ) : (
                        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed text-justify">
                            {gameInfo?.brief ? (
                                `"${gameInfo.brief}"`
                            ) : (
                                <span className="text-gray-500">لا يوجد وصف متاح حالياً</span>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </Dialog>
    )
}
