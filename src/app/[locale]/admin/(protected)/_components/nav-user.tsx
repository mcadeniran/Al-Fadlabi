"use client";

import {Avatar, AvatarFallback, } from "@/components/ui/avatar";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar";

type NavUserProps = {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function NavUser({user}: NavUserProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="h-auto cursor-default py-3 bg-plum-deep rounded-2xl"
          aria-label={`${user.name}, ${user.email}`}
        >
          <Avatar className="size-10 shrink-0 rounded-lg">
            <AvatarFallback className="rounded-lg bg-sidebar-primary text-white font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-white">
              {user.name}
            </span>

            <span className="truncate text-xs text-white/65">
              {user.email}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}