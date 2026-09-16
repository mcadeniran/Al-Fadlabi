"use client";

import * as React from "react";
import {
  IconInnerShadowTop,
} from "@tabler/icons-react";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {NavMain} from "./nav-main";
import {NavSecondary} from "./nav-secondary";
import {NavUser} from "./nav-user";
import {useTranslations} from "next-intl";
import {Boxes, ClipboardList, LayoutDashboard, Settings, ShoppingBag, Users} from "lucide-react";


export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Admin");

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        url: "/admin",
        title: t("dashboard"),
        icon: LayoutDashboard,
      },
      {
        url: "/admin/products",
        title: t("products"),
        icon: ShoppingBag,
      },
      {
        url: "/admin/orders",
        title: t("orders"),
        icon: ClipboardList,
      },
      {
        url: "/admin/customers",
        title: t("customers"),
        icon: Users,
      },
      {
        url: "/admin/inventory",
        title: t("inventory"),
        icon: Boxes,
      },

    ],

    navSecondary: [
      {
        url: "/admin/settings",
        title: t("settings"),
        icon: Settings,
      },
    ],
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={
                <a href="#">
                  <IconInnerShadowTop className="size-5!" />
                  <span className="text-base font-semibold">Acme Inc.</span>
                </a>
              }
            />
            {/* </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
