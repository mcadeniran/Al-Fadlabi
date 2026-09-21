import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  ClipboardList,
  PackagePlus,
  Users,
} from "lucide-react";
import type {AdminRole} from "@/lib/auth/admin";
import {getTranslations} from "next-intl/server";

const actions: {
  href: string;
  key: string;
  icon: typeof PackagePlus;
  featured?: boolean;
  roles: AdminRole[];
}[] = [
    {
      href: "/admin/products/new",
      key: "addProduct",
      icon: PackagePlus,
      featured: true,
      roles: ["owner", "admin"],
    },
    {
      href: "/admin/orders",
      key: "manageOrders",
      icon: ClipboardList,
      roles: ["owner", "admin", "manager"],
    },
    {
      href: "/admin/inventory",
      key: "manageInventory",
      icon: Boxes,
      roles: ["owner", "admin"],
    },
    {
      href: "/admin/users",
      key: "manageCustomers",
      icon: Users,
      roles: ["owner"],
    },
  ];

export async function QuickActions({
  role,
}: {
  role: AdminRole;
}) {
  const t = await getTranslations("AdminDashboard");

  const visibleActions = actions.filter((action) =>
    action.roles.includes(role),
  );

  return (
    <section className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
            {t('shortcuts')}
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
            {t("quickActions")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("quickActionsDescription")}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {visibleActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className={[
                "group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-md",
                action.featured
                  ? "border-neutral-900 bg-plum-deep text-white"
                  : "border-neutral-200 bg-neutral-50/70 text-neutral-950 hover:border-neutral-300 hover:bg-white",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={[
                    "flex size-10 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105",
                    action.featured
                      ? "border-white/10 bg-white/10 text-white"
                      : "border-neutral-200 bg-white text-neutral-700",
                  ].join(" ")}
                >
                  <Icon className="size-5" strokeWidth={1.8} />
                </div>

                <ArrowUpRight
                  className={[
                    "size-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                    action.featured
                      ? "text-white/50 group-hover:text-white"
                      : "text-neutral-300 group-hover:text-neutral-700",
                  ].join(" ")}
                />
              </div>

              <div className="mt-8">
                <p
                  className={[
                    "text-sm font-semibold",
                    action.featured ? "text-white" : "text-neutral-950",
                  ].join(" ")}
                >
                  {t(action.key)}
                </p>

                <p
                  className={[
                    "mt-1 text-xs",
                    action.featured ? "text-white/50" : "text-neutral-500",
                  ].join(" ")}
                >
                  {t(`quickActionDescriptions.${action.key}`)}
                </p>
              </div>

              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute -bottom-10 -right-10 size-24 rounded-full blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  action.featured ? "bg-white/10" : "bg-neutral-200/70",
                ].join(" ")}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
