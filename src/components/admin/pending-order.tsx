import Link from "next/link";
import {ArrowUpRight, ClipboardList} from "lucide-react";
import {getTranslations} from "next-intl/server";

type PendingOrdersProps = {
  count: number;
};

export async function PendingOrders({
  count,
}: PendingOrdersProps) {
  const t = await getTranslations("AdminDashboard");

  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-200/70 bg-white p-6 shadow-sm sm:p-7">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-amber-100/60 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
              <ClipboardList
                className="size-5"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                {t("pendingOrders")}
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                {t("pendingOrdersDescription")}
              </p>
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
          >
            {t("viewAllOrders")}

            <ArrowUpRight
              className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-5xl font-semibold tracking-tight text-neutral-950">
              {count}
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              {t("ordersAwaitingReview")}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-amber-500"
            />

            <span className="text-xs font-medium text-amber-800">
              {t("needsAttention")}
            </span>
          </div>
        </div>

        <div className="mt-6 h-1 overflow-hidden rounded-full bg-amber-100">
          <div
            className="h-full rounded-full bg-amber-400 transition-all duration-500"
            style={{
              width: count > 0 ? "100%" : "0%",
            }}
          />
        </div>
      </div>
    </section>
  );
}