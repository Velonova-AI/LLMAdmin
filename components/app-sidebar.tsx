"use client"
import * as React from "react"


import { VersionSwitcher } from "@/components/version-switcher"
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
    SidebarRail,
} from "@/components/ui/sidebar"
import {usePathname} from "next/navigation";

// This is sample data.
const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
        {
            title: "Documentation",
            url: "#",
            items: [
                {
                    title: "Introduction",
                    url: "/dashboard/documentation",
                },
                {
                    title: "Getting Started",
                    url: "/dashboard/documentation/getting-started",
                },
            ],
        },
        {
            title: "Building Your Aassistant",
            url: "#",
            items: [
                {
                    title: "Manage",
                    url: "/dashboard/assistants",
                    isActive: true,
                },
                {
                    title: "Create",
                    url: "/dashboard/assistants/create",

                },



            ],
        },
        {
            title: "Billing",
            url: "#",
            items: [
                {
                    title: "Manage",
                    url: "/dashboard/billing",
                },


            ],
        },
        {
            title: "Settings",
            url: "#",
            items: [
                {
                    title: "Feedback",
                    url: "/dashboard/feedback",
                },


            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <VersionSwitcher

                />

            </SidebarHeader>
            <SidebarContent>
                {/* We create a SidebarGroup for each parent. */}
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu >
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild
                                                           isActive={pathname === item.url}>
                                            <a href={item.url}>{item.title}</a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
