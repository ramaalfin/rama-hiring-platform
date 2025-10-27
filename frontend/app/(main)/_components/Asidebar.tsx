"use client";

import React, { useState, useMemo } from "react";
import {
  EllipsisIcon,
  Home,
  Loader,
  LogOut,
  MoonStarIcon,
  SunIcon,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import LogoutDialog from "./_common/LogoutDialog";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/authStore";

const Asidebar = () => {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const { open } = useSidebar();

  console.log("user", user);

  // dummy role
  // const role = "ADMIN";

  const items = useMemo(() => {
    if (!user?.role) return [];

    if (user.role === "ADMIN") {
      // if (role === "ADMIN") {
      return [
        {
          title: "Home",
          url: "/admin/home",
          icon: Home,
        },
        {
          title: "Job List",
          url: "/admin/job-list",
          icon: Briefcase,
        },
      ];
    }

    if (user.role === "CANDIDATE") {
      // if (role === "CANDIDATE") {
      return [
        {
          title: "Home",
          url: "/home",
          icon: Home,
        },
        {
          title: "Job List",
          url: "/job-list",
          icon: Briefcase,
        },
      ];
    }

    return [];
  }, [user?.role]);
  // }, [role]);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="!pt-0 dark:bg-background">
          <div className="flex h-[60px] items-center">
            <Logo fontSize="20px" size="30px" url="/home" />
            {open && (
              <Link
                href="/home"
                className="hidden md:flex ml-2 text-xl tracking-[-0.16px] text-black dark:text-[#fcfdffef] font-bold mb-0"
              >
                Rakamin
              </Link>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="dark:bg-background">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {!user ? (
                  <Loader className="animate-spin place-self-center my-4" />
                ) : (
                  items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url} className="!text-[15px]">
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="dark:bg-background">
          <SidebarMenu>
            <SidebarMenuItem>
              {!user ? (
                <Loader className="animate-spin place-self-center self-center" />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {user?.fullName?.split(" ")?.[0]?.charAt(0)}
                          {user?.fullName?.split(" ")?.[1]
                            ? user?.fullName?.split(" ")?.[1]?.charAt(0)
                            : null}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.fullName}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                      <EllipsisIcon className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          setTheme(theme === "light" ? "dark" : "light")
                        }
                      >
                        {theme === "light" ? <MoonStarIcon /> : <SunIcon />}
                        Toggle theme
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsOpen(true)}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <LogoutDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Asidebar;
