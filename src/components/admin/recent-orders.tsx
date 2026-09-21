import {Link} from "@/i18n/navigation";
import {
  ArrowUpRight,
  Check,
  Clock3,
  LoaderCircle,
  PackageCheck,
  CircleX
} from "lucide-react";
import {
  getLocale,
  getTranslations,
} from "next-intl/server";

type RecentOrder = {
  id: string;
  status: string;
  total: number | string | null;
  customer_name: string;
  created_at: string;
  order_number: string;
};

type RecentOrdersProps = {
  orders: RecentOrder[];
};

// type OrderStatus = "pending" | "processing" | "delivered" | "cancelled" | "confirmed" | "out_for_delivery" | "rejected";


function getOrderStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return {
        icon: Clock3,
        className:
          "border-amber-200 bg-amber-50 text-amber-800",
      };

    case "processing":
    case "confirmed":
      return {
        icon: LoaderCircle,
        className:
          "border-blue-200 bg-blue-50 text-blue-800",
      };

    case "completed":
    case "delivered":
      return {
        icon: Check,
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-800",
      };

    case "out_for_delivery":
      return {
        icon: PackageCheck,
        className:
          "border-indigo-200 bg-indigo-50 text-indigo-800",
      };

    case "rejected":
    case "cancelled":
      return {
        icon: CircleX,
        className: "border-red-200 bg-red-50 text-red-800",
      };

    default:
      return {
        icon: Clock3,
        className:
          "border-neutral-200 bg-neutral-50 text-neutral-700",
      };
  }
}

export async function RecentOrders({
  orders,
}: RecentOrdersProps) {
  const locale = await getLocale();
  const t = await getTranslations("AdminDashboard");
  const m = await getTranslations("AdminOrders");


  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar" : "en",
    {
      month: "short",
      day: "numeric",
    },
  );

  const numberFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar" : "en",
    {
      style: "currency",
      currency: "SDG",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-200/80 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
            {t('activity')}
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
            {t("recentOrders")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("recentOrdersDescription")}
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="group inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950"
        >
          {t("viewAllOrders")}

          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center p-6">
          <div className="text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-neutral-100">
              <PackageCheck
                className="size-5 text-neutral-500"
                strokeWidth={1.7}
              />
            </div>

            <p className="mt-3 text-sm font-medium text-neutral-900">
              {t("noRecentOrders")}
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {orders.map((order) => {
            const status = getOrderStatusStyle(order.status);
            const StatusIcon = status.icon;

            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.order_number} `}
                className="group block px-6 py-5 transition-colors duration-200 hover:bg-neutral-50/70 sm:px-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Customer / Order */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
                      #
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-neutral-950">
                        {order.customer_name}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                        <span className="font-medium text-neutral-600">
                          #{order.order_number}
                        </span>

                        <span aria-hidden="true">·</span>

                        <span>
                          da
                          {dateFormatter.format(
                            new Date(order.created_at),
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status / Amount */}
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                        status.className,
                      ].join(" ")}
                    >
                      <StatusIcon
                        className={[
                          "size-3.5",
                          order.status.toLowerCase() === "processing"
                            ? "animate-spin"
                            : "",
                        ].join(" ")}
                        strokeWidth={1.8}
                      />
                      {m(`statuses.${order.status}`)}
                      {/* {orderw.status.replaceAll("_", " ")} */}
                    </span>

                    <span className="whitespace-nowrap text-sm font-semibold text-neutral-950">
                      {numberFormatter.format(
                        Number(order.total ?? 0),
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}