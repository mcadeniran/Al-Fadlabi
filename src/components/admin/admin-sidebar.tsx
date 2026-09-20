"use client";

import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";

const navigation = [
  {
    href: "/admin",
    key: "dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    key: "products",
    icon: ShoppingBag,
  },
  {
    href: "/admin/orders",
    key: "orders",
    icon: ClipboardList,
  },
  {
    href: "/admin/users",
    key: "users",
    icon: Users,
  },
  {
    href: "/admin/inventory",
    key: "inventory",
    icon: Boxes,
  },
  {
    href: "/admin/settings",
    key: "settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const t = useTranslations("Admin");

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            <Icon className="size-4 shrink-0" />
            <span>{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}