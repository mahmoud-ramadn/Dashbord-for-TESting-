import { ChevronDown, HomeIcon, Settings, StarIcon, Users } from "lucide-react"

import { Link } from "react-router"

import { PermissionEnum, PermissionsBusinessModule } from "@/lib/permissions"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import LogoImage from "@/assets/images/logo.svg"
import PermissionsRender from "@/components/permissions/render"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"

export default function DashboardSidebar() {
    return (
        <Sidebar dir="rtl" side="right">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarHeader className="py-6">
                        <img src={LogoImage} alt="logo" className="w-28 aspect-square mx-auto block" />
                    </SidebarHeader>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            <PermissionsRender
                                businessModule={PermissionsBusinessModule.DASHBOARD}
                                permissions={[PermissionEnum.VIEW]}
                            >
                                <SidebarMenuItem className="flex items-center gap-x-2">
                                    <HomeIcon className="size-6 stroke-primary" />
                                    <SidebarMenuButton asChild>
                                        <Link to="/">الرئيسية</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </PermissionsRender>

                            <PermissionsRender
                                businessModule={PermissionsBusinessModule.GROUPS}
                                permissions={[PermissionEnum.VIEW]}
                            >
                                <SidebarMenuItem className="flex items-center gap-x-2">
                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                    <SidebarMenuButton asChild>
                                        <Link to="/groups">المجموعات</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </PermissionsRender>

                            <PermissionsRender
                                businessModule={PermissionsBusinessModule.CATEGORIES}
                                permissions={[PermissionEnum.VIEW]}
                            >
                                <SidebarMenuItem className="flex items-center gap-x-2">
                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                    <SidebarMenuButton asChild>
                                        <Link to="/categories">التصنيفات</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </PermissionsRender>

                            <PermissionsRender
                                businessModule={PermissionsBusinessModule.QUESTIONS}
                                permissions={[PermissionEnum.VIEW]}
                            >
                                <SidebarMenuItem className="flex items-center gap-x-2">
                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                    <SidebarMenuButton asChild>
                                        <Link to="/questions">الأسئلة</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </PermissionsRender>

                            <PermissionsRender
                                businessModule={PermissionsBusinessModule.GAME_PACKAGES}
                                permissions={[PermissionEnum.VIEW]}
                            >
                                <SidebarMenuItem className="flex items-center gap-x-2">
                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                    <SidebarMenuButton asChild>
                                        <Link to="/packages">الباقات</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </PermissionsRender>
                            <PermissionsRender
                                businessModule={PermissionsBusinessModule.ANALYTICS}
                                permissions={[PermissionEnum.VIEW]}
                            >
                                <SidebarMenuItem className="flex items-center gap-x-2">
                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                    <SidebarMenuButton asChild>
                                        <Link to="/packages-analytics"> تحليل الباقات</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </PermissionsRender>

                            <PermissionsRender
                                businessModule={PermissionsBusinessModule.CONTACT_US}
                                permissions={[PermissionEnum.VIEW]}
                            >
                                <SidebarMenuItem className="flex items-center gap-x-2">
                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                    <SidebarMenuButton asChild>
                                        <Link to="/contact-us">الرسائل</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </PermissionsRender>

                            <PermissionsRender
                                businessModule={PermissionsBusinessModule.REPORTS}
                                permissions={[PermissionEnum.VIEW]}
                            >
                                <SidebarMenuItem className="flex items-center gap-x-2">
                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />

                                    <SidebarMenuButton asChild>
                                        <Link to="/reports">التقارير</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </PermissionsRender>

                            <Collapsible>
                                <SidebarGroup className="p-0!">
                                    <SidebarGroupLabel asChild>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-black! font-medium! gap-x-2 p-0!">
                                            <div className="flex items-center gap-x-2">
                                                <Users className="size-5" />
                                                <span>الموظفين</span>
                                            </div>
                                            <ChevronDown className="size-4 text-primary transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </CollapsibleTrigger>
                                    </SidebarGroupLabel>

                                    <CollapsibleContent>
                                        <SidebarGroupContent className="space-y-2 mt-2">
                                            <PermissionsRender
                                                businessModule={PermissionsBusinessModule.ROLES}
                                                permissions={[PermissionEnum.VIEW]}
                                            >
                                                <SidebarMenuItem className="flex items-center gap-x-2">
                                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                                    <SidebarMenuButton asChild>
                                                        <Link to="/roles">الأدوار</Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            </PermissionsRender>

                                            <PermissionsRender
                                                businessModule={PermissionsBusinessModule.USERS}
                                                permissions={[PermissionEnum.VIEW]}
                                            >
                                                <SidebarMenuItem className="flex items-center gap-x-2">
                                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                                    <SidebarMenuButton asChild>
                                                        <Link to="/users">المستخدمين</Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            </PermissionsRender>
                                        </SidebarGroupContent>
                                    </CollapsibleContent>
                                </SidebarGroup>
                            </Collapsible>

                            <Collapsible>
                                <SidebarGroup className="p-0!">
                                    <SidebarGroupLabel asChild>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full text-black! font-medium! gap-x-2 p-0!">
                                            <div className="flex items-center gap-x-2">
                                                <Settings className="size-5" />
                                                <span>الإعدادات</span>
                                            </div>
                                            <ChevronDown className="size-4 text-primary transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </CollapsibleTrigger>
                                    </SidebarGroupLabel>

                                    <CollapsibleContent>
                                        <SidebarGroupContent className="space-y-2 mt-2">
                                            <PermissionsRender
                                                businessModule={PermissionsBusinessModule.SETTINGS}
                                                permissions={[PermissionEnum.VIEW]}
                                            >
                                                <SidebarMenuItem className="flex items-center gap-x-2">
                                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                                    <SidebarMenuButton asChild>
                                                        <Link to="/terms-and-conditions">الشروط والأحكام</Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            </PermissionsRender>

                                            <PermissionsRender
                                                businessModule={PermissionsBusinessModule.SETTINGS}
                                                permissions={[PermissionEnum.VIEW]}
                                            >
                                                <SidebarMenuItem className="flex items-center gap-x-2">
                                                    <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                                    <SidebarMenuButton asChild>
                                                        <Link to="/policies">السياسات</Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            </PermissionsRender>

                                            <SidebarMenuItem className="flex items-center gap-x-2">
                                                <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                                <PermissionsRender
                                                    businessModule={PermissionsBusinessModule.GAMES}
                                                    permissions={[PermissionEnum.VIEW]}
                                                >
                                                    <SidebarMenuButton asChild>
                                                        <Link to="/game-info">عن اللعبة</Link>
                                                    </SidebarMenuButton>
                                                </PermissionsRender>
                                            </SidebarMenuItem>

                                            <SidebarMenuItem className="flex items-center gap-x-2">
                                                <StarIcon className="size-6 fill-yellow-400 stroke-none" />
                                                <PermissionsRender
                                                    businessModule={PermissionsBusinessModule.SETTINGS}
                                                    permissions={[PermissionEnum.VIEW]}
                                                >
                                                    <SidebarMenuButton asChild>
                                                        <Link to="/game-settings">إعدادات اللعبة</Link>
                                                    </SidebarMenuButton>
                                                </PermissionsRender>
                                            </SidebarMenuItem>
                                        </SidebarGroupContent>
                                    </CollapsibleContent>
                                </SidebarGroup>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
