import {useTranslations} from "next-intl";
import {ArrowRight} from "lucide-react";

import type {CustomerOrder} from "@/types/order";
import {Link} from "@/i18n/navigation";

type CustomerOrdersProps = {
  orders: CustomerOrder[];
  locale: string;
};

export function CustomerOrders({orders, locale}: CustomerOrdersProps) {
  const t = useTranslations("Auth");

  const isAr = locale === 'ar';

  return (
    <section>
      <div className="mb-10 max-w-2xl">
        <h2 className={`font-editorial leading-[0.9] tracking-[-0.035em]  ${isAr ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"} `}>
          {t("orders.title")}
        </h2>

        <p className="mt-5 text-sm leading-7 text-ink/50">
          {t("orders.description")}
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="border-t border-ink/15">
          {orders.map((order, index) => (
            <OrderRow
              key={order.id}
              order={order}
              locale={locale}
              t={t}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type OrderRowProps = {
  order: CustomerOrder;
  locale: string;
  t: ReturnType<typeof useTranslations<"Auth">>;
  index: number;
};

function OrderRow({
  order,
  locale,
  t,
  index,
}: OrderRowProps) {
  const isAr = locale === 'ar';

  const itemCount = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const formattedDate = formatOrderDate(
    order.createdAt,
    locale,
  );

  const formattedTotal = formatOrderPrice(
    order.total,
    locale,
  );

  return (
    <article className="group border-b border-ink/10 py-8 px-2 transition-colors hover:bg-white sm:py-10 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[80px_minmax(0,1fr)_auto] lg:items-center lg:gap-10">
        <div className="hidden lg:block">
          <span className="font-editorial text-3xl leading-none text-plum/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between lg:justify-start lg:gap-12">
            <div>
              <p className={`${isAr ? "text-base" : "text-sm"} font-semibold uppercase tracking-[0.28em] text-ink/30`}>
                {t("orders.orderNumber")}
              </p>

              <p className="mt-3 break-all font-editorial text-3xl leading-none tracking-[-0.02em] sm:text-4xl">
                {order.orderNumber}
              </p>

              <p className={`mt-3 ${isAr ? "text-sm" : "text-xs"} text-ink/40`}>
                {formattedDate}
              </p>
            </div>

            <OrderStatusBadge
              status={order.status}
              t={t}
              isAr
            />
          </div>

          <div className="mt-8 grid gap-6 border-t border-ink/10 pt-6 sm:grid-cols-3 lg:mt-9 lg:max-w-2xl">
            <OrderMeta
              label={t("orders.items")}
              value={formatItemCount(itemCount, t)}
              isAr
            />

            <OrderMeta
              label={t("orders.delivery")}
              value={formatDeliveryMethod(
                order.deliveryMethod,
                t,
              )}
              isAr
            />

            <OrderMeta
              label={t("orders.total")}
              value={formattedTotal}
              isAr
            />
          </div>
        </div>

        <div className="lg:justify-self-end">
          <Link
            href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
            className={`group/link inline-flex items-center gap-4 border-b border-ink/25 pb-2 ${isAr ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.24em] text-ink transition-colors hover:border-plum hover:text-plum`}
          >
            <span>{t("orders.viewOrder")}</span>

            <ArrowRight
              size={14}
              strokeWidth={1.25}
              className="transition-transform duration-300 group-hover/link:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

type OrderMetaProps = {
  label: string;
  value: string;
  isAr: boolean;
};

function OrderMeta({
  label,
  value,
  isAr
}: OrderMetaProps) {
  return (
    <div className="space-y-2">
      <p className={`${isAr ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/30`}>
        {label}
      </p>

      <p className={`${isAr ? "text-base" : "text-sm"} text-ink/70`}>
        {value}
      </p>
    </div>
  );
}

type OrderStatusBadgeProps = {
  status: CustomerOrder["status"];
  t: ReturnType<typeof useTranslations<"Auth">>;
  isAr: boolean;
};

function OrderStatusBadge({
  status,
  t,
  isAr
}: OrderStatusBadgeProps) {
  const tone = getStatusTone(status);

  return (
    <div className="inline-flex items-center gap-3 self-start">
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />

      <span className={`${isAr ? "text-base" : "text-sm"} font-semibold uppercase tracking-[0.25em] ${tone.text}`}>
        {getStatusLabel(status, t)}
      </span>
    </div>
  );
}

function EmptyOrders() {
  const t = useTranslations("Auth");

  return (
    <div className="border-t border-ink/15 py-16 text-center sm:py-20">
      <div className="mx-auto h-px w-10 bg-coral" />

      <p className="mt-7 eyebrow text-plum">
        {t("orders.emptyEyebrow")}
      </p>

      <h3 className="mt-4 font-editorial text-4xl leading-[0.9] tracking-[-0.035em] sm:text-5xl">
        {t("orders.emptyTitle")}
      </h3>

      <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-ink/45">
        {t("orders.emptyDescription")}
      </p>

      <Link
        href="/shop"
        className="button-editorial button-editorial-primary mt-8 inline-flex items-center justify-center gap-4"
      >
        <span>{t("orders.shopNow")}</span>

        <ArrowRight
          size={15}
          strokeWidth={1.25}
        />
      </Link>
    </div>
  );
}

function getStatusTone(status: CustomerOrder["status"]) {
  switch (status) {
    case "confirmed":
      return {
        dot: "bg-plum",
        text: "text-plum",
      };

    case "processing":
      return {
        dot: "bg-coral",
        text: "text-coral",
      };

    case "out_for_delivery":
      return {
        dot: "bg-plum",
        text: "text-plum",
      };

    case "delivered":
      return {
        dot: "bg-ink/50",
        text: "text-ink/55",
      };

    case "rejected":
      return {
        dot: "bg-coral",
        text: "text-coral",
      };

    case "cancelled":
      return {
        dot: "bg-ink/30",
        text: "text-ink/40",
      };

    case "pending":
    default:
      return {
        dot: "bg-coral",
        text: "text-coral",
      };
  }
}

function getStatusLabel(
  status: CustomerOrder["status"],
  t: ReturnType<typeof useTranslations<"Auth">>,
) {
  switch (status) {
    case "pending":
      return t("orders.status.pending");
    case "confirmed":
      return t("orders.status.confirmed");
    case "processing":
      return t("orders.status.processing");
    case "out_for_delivery":
      return t("orders.status.outForDelivery");
    case "delivered":
      return t("orders.status.delivered");
    case "rejected":
      return t("orders.status.rejected");
    case "cancelled":
      return t("orders.status.cancelled");
    default:
      return status;
  }
}

function formatDeliveryMethod(
  method: CustomerOrder["deliveryMethod"],
  t: ReturnType<typeof useTranslations<"Auth">>,
) {
  switch (method) {
    case "standard":
      return t("orders.deliveryMethods.standard");
    case "express":
      return t("orders.deliveryMethods.express");
    default:
      return method;
  }
}

function formatItemCount(
  count: number,
  t: ReturnType<typeof useTranslations<"Auth">>,
) {
  return count === 1
    ? t("orders.itemCount.one")
    : t("orders.itemCount.other", {
      count,
    });
}

function formatOrderDate(
  value: string,
  locale: string,
) {
  try {
    return new Intl.DateTimeFormat(
      locale === "ar" ? "ar" : "en",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    ).format(new Date(value));
  } catch {
    return value;
  }
}

function formatOrderPrice(
  value: number,
  locale: string,
) {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar" : "en", {
      style: "currency",
      currency: "SDG",
      maximumFractionDigits: 0,
    })
      .format(value);
  } catch {
    return String(value);
  }
}