"use client";

import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {LucideIcon} from "lucide-react";
import {Link, usePathname} from "@/i18n/navigation";

export function NavSecondary({
  items,
  onNavigate,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
  onNavigate?: () => void;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/admin" &&
                pathname.startsWith(`${item.url}/`));

            return <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActive}
                tooltip={item.title}
                className={`${isActive && "bg-plum-deep text-white rounded-2xl hover:bg-plum"} hover:bg-plum hover:rounded-2xl mb-2 hover:text-white`}
                render={
                  <Link
                    href={item.url}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>;
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
