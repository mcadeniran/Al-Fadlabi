"use client";

import * as React from "react";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from "@/components/ui/sidebar";
import {NavMain} from "./nav-main";
import {NavSecondary} from "./nav-secondary";
import {NavUser} from "./nav-user";
import {useLocale, useTranslations} from "next-intl";
import {Boxes, ClipboardList, LayoutDashboard, Settings, ShoppingBag, Users, } from "lucide-react";
import {Link} from "@/i18n/navigation";

import type {AdminRole} from "@/lib/auth/admin";
import {AdminPermission, hasAdminPermission} from "@/lib/admin/admin-permissions";
import Image from "next/image";
import {CustomerProfile} from "@/lib/customers/customer-profile";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role: AdminRole;
  customer: CustomerProfile;
};

export function AppSidebar({
  role,
  customer,
  ...props
}: AppSidebarProps) {
  const t = useTranslations("Admin");
  const locale = useLocale();

  const {setOpenMobile} = useSidebar();

  const data = {
    user: {
      name: customer.fullName,
      email: customer.email ?? '',
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
        permission: "products" as AdminPermission,
      },

      {
        url: "/admin/orders",
        title: t("orders"),
        icon: ClipboardList,
      },

      {
        url: "/admin/users",
        title: t("users"),
        icon: Users,
        permission: "users" as AdminPermission,
      },

      {
        url: "/admin/inventory",
        title: t("inventory"),
        icon: Boxes,
        permission: "inventories" as AdminPermission
      },

      {
        url: "/admin/account",
        title: t("account"),
        icon: Settings,
      },
    ],

    navSecondary: [

    ],
  };

  const visibleNavMain = data.navMain.filter(
    (item) =>
      !item.permission ||
      hasAdminPermission(role, item.permission),
  );

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      side={locale === "ar" ? "right" : "left"}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-16 px-3 hover:bg-sidebar-accent"
            >
              <Link
                href="/admin"
                className="flex items-center gap-3"
              >
                <Image
                  src="/images/brand/al-fadlabi-logo.png"
                  alt={t("brandName")}
                  width={44}
                  height={44}
                  priority
                  className="size-11 shrink-0 object-contain"
                />

                <span className="truncate text-base font-semibold tracking-tight">
                  {t("brandName")}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={visibleNavMain} onNavigate={() => setOpenMobile(false)} />

        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
          onNavigate={() => setOpenMobile(false)}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}