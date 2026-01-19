"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Session } from "@/app/(auth)/auth";
import { signOut } from "@/app/(auth)/auth";
import Form from "next/form";
type User = Session["user"];
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { guestRegex } from "@/lib/constants";
import { LoaderIcon } from "./icons";
import { toast } from "./toast";

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  const isGuest = guestRegex.test(user?.email ?? "");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="h-10 bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              data-testid="user-nav-button"
            >
              <Image
                alt={user?.email ?? "User Avatar"}
                className="rounded-full"
                height={24}
                src={`https://avatar.vercel.sh/${user?.email}`}
                width={24}
              />
              <span className="truncate" data-testid="user-email">
                {isGuest ? "Guest" : user?.email}
              </span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-popper-anchor-width)"
            data-testid="user-nav-menu"
            side="top"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              data-testid="user-nav-item-theme"
              onSelect={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isGuest ? (
              <DropdownMenuItem
                className="cursor-pointer"
                data-testid="user-nav-item-auth"
                onSelect={() => router.push("/login")}
              >
                Login to your account
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild data-testid="user-nav-item-auth">
                <Form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                  className="w-full"
                >
                  <button className="w-full cursor-pointer text-left" type="submit">
                    Sign out
                  </button>
                </Form>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
