import {getTranslations} from "next-intl/server";
import type {DeliveryMethod, Order, OrderStatus} from "@/types/order";
import {ArrowLeft, ArrowRight, Package} from "lucide-react";
import {Link} from "@/i18n/navigation";

import {CustomerOrderProgress} from "./customer-order-progress";

type CustomerOrderDetailsProps = {
  order: Order;
  locale: string;
};

function formatPrice(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en", {
    style: "currency",
    currency: "SDG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(
    locale === "ar" ? "ar" : "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date(date));
}

function getStatusKey(status: OrderStatus) {
  const keys: Record<OrderStatus, string> = {
    pending: "pending",
    confirmed: "confirmed",
    processing: "processing",
    out_for_delivery: "outForDelivery",
    delivered: "delivered",
    rejected: "rejected",
    cancelled: "cancelled",
  };

  return keys[status];
}

function getDeliveryKey(deliveryMethod: DeliveryMethod) {
  return deliveryMethod === "express"
    ? "express"
    : "standard";
}

function getStatusTone(status: OrderStatus) {
  switch (status) {
    case "confirmed":
    case "out_for_delivery":
      return {
        dot: "bg-plum",
        text: "text-plum",
      };

    case "processing":
    case "pending":
      return {
        dot: "bg-coral",
        text: "text-coral",
      };

    case "delivered":
      return {
        dot: "bg-ink/45",
        text: "text-ink/55",
      };

    case "rejected":
      return {
        dot: "bg-coral",
        text: "text-coral",
      };

    case "cancelled":
      return {
        dot: "bg-ink/25",
        text: "text-ink/40",
      };

    default:
      return {
        dot: "bg-ink/30",
        text: "text-ink/45",
      };
  }
}

export async function CustomerOrderDetails({
  order,
  locale,
}: CustomerOrderDetailsProps) {
  const t = await getTranslations("Auth");

  const statusKey = getStatusKey(order.status);
  const deliveryKey = getDeliveryKey(order.deliveryMethod);

  const itemCount = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const customerName = [
    order.customer.firstName,
    order.customer.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const statusTone = getStatusTone(order.status);

  return (
    <section className="space-y-20">
      <header>
        <Link href="/account" className="group inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-ink/40 transition-colors hover:text-plum">
          <ArrowLeft size={14} strokeWidth={1.25} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span>{t("orders.details.backToOrders")}</span>
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow text-plum">
              {t("orders.details.eyebrow")}
            </p>

            <h1 className="mt-5 break-all font-editorial text-5xl leading-[0.86] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              {order.orderNumber}
            </h1>

            <p className="mt-5 text-xs text-ink/40">
              {formatDate(order.createdAt, locale)}
            </p>
          </div>

          <div className="flex items-center gap-3 lg:pb-1">
            <span className={`h-1.5 w-1.5 rounded-full ${statusTone.dot}`} />

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-ink/30">
                {t("orders.details.status")}
              </p>

              <p className={`mt-2 text-sm ${statusTone.text}`}>
                {t(`orders.status.${statusKey}`)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 h-px bg-ink/10" />
      </header>

      <CustomerOrderProgress status={order.status} />

      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-24">
        <div className="min-w-0 space-y-16">
          <section>
            <div className="mb-8 flex items-end gap-5">
              <span className="font-editorial text-3xl text-plum/70">
                01
              </span>

              <div className="h-px flex-1 bg-ink/10" />

              <div>
                <p className="eyebrow text-ink/35">
                  {t("orders.details.itemsEyebrow")}
                </p>

                <h2 className="mt-3 font-editorial text-3xl leading-[0.9] tracking-[-0.03em] sm:text-4xl">
                  {t("orders.details.itemsTitle")}
                </h2>
              </div>
            </div>

            <div className="border-t border-ink/15">
              {order.items.map((item) => {
                const englishTranslation =
                  item.product.translations.find(
                    (translation) => translation.locale === "en",
                  );

                const arabicTranslation =
                  item.product.translations.find(
                    (translation) => translation.locale === "ar",
                  );

                const productName =
                  locale === "ar"
                    ? arabicTranslation?.name ??
                    englishTranslation?.name ??
                    "Product"
                    : englishTranslation?.name ??
                    arabicTranslation?.name ??
                    "Product";

                return (
                  <article
                    key={item.product.id + item.size.id}
                    className="group flex gap-5 border-b border-ink/10 py-7 sm:gap-7 sm:py-9"
                  >
                    <div className="flex h-28 w-24 shrink-0 items-center justify-center bg-white sm:h-36 sm:w-28">
                      <Package
                        className="absolute h-5 w-5 text-ink/10"
                        strokeWidth={1.25}
                      />

                      <span className="relative z-10 font-editorial text-2xl text-ink/60">
                        {item.size.ml}
                        <span className="ml-1 text-xs font-sans tracking-normal text-ink/30">
                          ml
                        </span>
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                        <div>
                          <h3 className="font-editorial text-2xl leading-[0.95] tracking-tight sm:text-3xl">
                            {productName}
                          </h3>

                          <p className="mt-3 text-[8px] font-semibold uppercase tracking-[0.24em] text-ink/35">
                            {item.size.ml} ml
                          </p>
                        </div>

                        <p className="shrink-0 font-editorial text-2xl leading-none sm:text-3xl">
                          {formatPrice(item.lineTotal, locale)}
                        </p>
                      </div>

                      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[8px] font-semibold uppercase tracking-[0.22em] text-ink/35">
                        <span>
                          {t("orders.details.quantity")} {item.quantity}
                        </span>

                        <span className="h-1 w-1 self-center rounded-full bg-plum/40" />

                        <span>
                          {t("orders.details.unitPrice")}{" "}
                          {formatPrice(item.unitPrice, locale)}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-8 flex items-end gap-5">
              <span className="font-editorial text-3xl text-plum/70">
                02
              </span>

              <div className="h-px flex-1 bg-ink/10" />

              <div>
                <p className="eyebrow text-ink/35">
                  {t("orders.details.deliveryEyebrow")}
                </p>

                <h2 className="mt-3 font-editorial text-3xl leading-[0.9] tracking-[-0.03em] sm:text-4xl">
                  {t("orders.details.deliveryTitle")}
                </h2>
              </div>
            </div>

            <div className="grid gap-x-10 gap-y-8 border-t border-ink/15 pt-7 sm:grid-cols-2">
              <DetailBlock
                label={t("orders.details.customer")}
                value={customerName || "—"}
              />

              <DetailBlock
                label={t("orders.details.phone")}
                value={order.customer.phone || "—"}
              />

              <DetailBlock
                label={t("orders.details.address")}
                value={order.deliveryAddress.address || "—"}
              />

              <DetailBlock
                label={t("orders.details.city")}
                value={order.deliveryAddress.city || "—"}
              />

              <DetailBlock
                label={t("orders.details.deliveryMethod")}
                value={t(`orders.deliveryMethods.${deliveryKey}`)}
              />

              {order.deliveryAddress.notes ? (
                <DetailBlock
                  label={t("orders.details.notes")}
                  value={order.deliveryAddress.notes}
                  wide
                />
              ) : null}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="border-t-2 border-ink bg-white px-7 py-8 sm:px-9 sm:py-10">
            <p className="eyebrow text-plum">
              {t("orders.details.summaryEyebrow")}
            </p>

            <h2 className="mt-4 font-editorial text-3xl leading-[0.9] tracking-[-0.03em]">
              {t("orders.details.summaryTitle")}
            </h2>

            <div className="mt-9 space-y-5">
              <SummaryRow
                label={t("orders.details.items")}
                value={String(itemCount)}
              />

              <SummaryRow
                label={t("orders.details.subtotal")}
                value={formatPrice(order.subtotal, locale)}
              />

              <SummaryRow
                label={t("orders.details.delivery")}
                value={formatPrice(order.deliveryCost, locale)}
              />

              <div className="border-t border-ink/10 pt-6">
                <div className="flex items-end justify-between gap-6">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                    {t("orders.details.total")}
                  </span>

                  <span className="font-editorial text-3xl leading-none">
                    {formatPrice(order.total, locale)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-9 border-t border-ink/10 pt-7">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-ink/30">
                  {t("orders.details.payment")}
                </p>

                <p className="mt-3 text-sm text-ink/70">
                  {t("orders.details.payOnDelivery")}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-ink/30">
                  {t("orders.details.paymentStatus")}
                </p>

                <p className="mt-3 text-sm text-ink/70">
                  {order.paymentStatus === "paid"
                    ? t("orders.details.paid")
                    : t("orders.details.paymentPending")}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className="group mt-7 inline-flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.24em] text-ink/45 transition-colors hover:text-plum"
          >
            <span>{t("orders.shopNow")}</span>

            <ArrowRight
              size={14}
              strokeWidth={1.25}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </aside>
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-ink/40">
        {label}
      </span>

      <span className="text-sm text-ink/70">
        {value}
      </span>
    </div>
  );
}

function DetailBlock({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-ink/30">
        {label}
      </p>

      <p className="mt-3 text-sm leading-7 text-ink/70">
        {value}
      </p>
    </div>
  );
}