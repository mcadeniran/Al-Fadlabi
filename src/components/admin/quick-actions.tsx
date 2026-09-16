import Link from "next/link";
import {
  ClipboardList,
  PackagePlus,
  Boxes,
  Users,
} from "lucide-react";
import {getTranslations} from "next-intl/server";

const actions = [
  {
    href: "/admin/products/new",
    key: "addProduct",
    icon: PackagePlus,
  },
  {
    href: "/admin/orders",
    key: "manageOrders",
    icon: ClipboardList,
  },
  {
    href: "/admin/inventory",
    key: "manageInventory",
    icon: Boxes,
  },
  {
    href: "/admin/customers",
    key: "manageCustomers",
    icon: Users,
  },
];

export async function QuickActions() {
  const t = await getTranslations("AdminDashboard");

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-950">
          {t("quickActions")}
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          {t("quickActionsDescription")}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <Icon className="size-5 text-neutral-700" />
              </div>

              <span className="text-sm font-medium text-neutral-800 group-hover:text-neutral-950">
                {t(action.key)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}