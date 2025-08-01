"use client"

import * as React from "react"
import {GalleryVerticalEnd} from "lucide-react"
import Image from "next/image"

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
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">

                        <Image 
                            src="/images/V1-logo.jpg" 
                            alt="Velonova Logo" 
                            width={32} 
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">

                        <span className="font-semibold">Velonova.ai</span>
                        <p> Beta</p>

                    </div>
                    {/*<ChevronsUpDown className="ml-auto" />*/}
                </SidebarMenuButton>

            </SidebarMenuItem>
        </SidebarMenu>
    )
}
