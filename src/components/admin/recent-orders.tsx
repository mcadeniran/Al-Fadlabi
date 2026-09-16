import {Link} from "@/i18n/navigation";
import {ArrowUpRight} from "lucide-react";
import {getLocale, getTranslations} from "next-intl/server";

type RecentOrder = {
  id: string;
  status: string;
  total: number | string | null;
  customer_name: string;
  created_at: string;
};

type RecentOrdersProps = {
  orders: RecentOrder[];
};

export async function RecentOrders({orders}: RecentOrdersProps) {
  const locale = await getLocale();
  const t = await getTranslations("AdminDashboard");

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar" : "en",
    {
      dateStyle: "medium",
    },
  );

  const numberFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar" : "en",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950">
            {t("recentOrders")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("recentOrdersDescription")}
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-neutral-950"
        >
          {t("viewAllOrders")}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-6 text-sm text-neutral-500">
          {t("noRecentOrders")}
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex flex-col gap-3 p-5 transition hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-950">
                  {order.customer_name}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {dateFormatter.format(new Date(order.created_at))}
                </p>
              </div>

              <div className="flex items-center justify-between gap-6 sm:justify-end">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-700">
                  {order.status.replaceAll("_", " ")}
                </span>

                <span className="text-sm font-semibold text-neutral-950">
                  {numberFormatter.format(Number(order.total ?? 0))}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}