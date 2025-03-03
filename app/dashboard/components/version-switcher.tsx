"use client"

import * as React from "react"
import {GalleryVerticalEnd, Shield} from "lucide-react"


import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function VersionSwitcher() {

    return (
        <SidebarMenu>
            <SidebarMenuItem>


                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">

                        <Shield className="size-4"/>
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">

                        <span className="font-semibold">Neurosecure.ai</span>
                        <p> Beta</p>

                    </div>
                    {/*<ChevronsUpDown className="ml-auto" />*/}
                </SidebarMenuButton>

            </SidebarMenuItem>
        </SidebarMenu>
    )
}
