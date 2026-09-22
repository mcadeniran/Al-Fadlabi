import {getTranslations} from "next-intl/server";
import type {CustomerOrder, DeliveryMethod, OrderStatus} from "@/types/order";
import {ArrowLeft, ArrowRight} from "lucide-react";
import Image from "next/image";
import {Link} from "@/i18n/navigation";

import {CustomerOrderProgress} from "./customer-order-progress";

type CustomerOrderDetailsProps = {
  order: CustomerOrder;
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
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
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
  return deliveryMethod === "express" ? "express" : "standard";
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

export async function CustomerOrderDetails({order, locale}: CustomerOrderDetailsProps) {
  const t = await getTranslations("Auth");

  const statusKey = getStatusKey(order.status);
  const deliveryKey = getDeliveryKey(order.deliveryMethod);
  const isAr = locale === "ar";

  const isDeliveryFeeConfirmed = order.deliveryFeeConfirmed;

  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);

  const customerName = [order.customer.firstName, order.customer.lastName].filter(Boolean).join(" ");

  const statusTone = getStatusTone(order.status);

  const BackArrow = isAr ? ArrowRight : ArrowLeft;
  const ActionArrow = isAr ? ArrowLeft : ArrowRight;

  const headingClass = isAr ? "font-sans font-semibold" : "font-editorial";
  const smallLabelClass = isAr ? "text-xs font-medium leading-6" : "text-[9px] font-semibold uppercase tracking-[0.2em]";
  const tinyLabelClass = isAr ? "text-xs font-medium leading-6" : "text-[9px] font-semibold uppercase tracking-[0.2em]";

  return (
    <section className="space-y-16 sm:space-y-20">
      <header>
        <Link href="/account" className={`group inline-flex items-center gap-3 text-ink/45 transition-colors hover:text-plum ${isAr ? "text-sm" : "text-[10px] font-semibold uppercase tracking-[0.2em]"}`}>
          <BackArrow size={15} strokeWidth={1.25} className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
          <span>{t("orders.details.backToOrders")}</span>
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
          <div>
            <p className={`text-plum ${smallLabelClass}`}>{t("orders.details.eyebrow")}</p>

            <h1 className={`mt-4 wrap-break-word text-4xl leading-[0.95] tracking-tight text-ink sm:text-5xl lg:text-6xl ${headingClass}`}>
              {order.orderNumber}
            </h1>

            <p className={`mt-4 text-ink/45 ${isAr ? "text-sm leading-7" : "text-xs"}`}>
              {formatDate(order.createdAt, locale)}
            </p>
          </div>

          <div className="flex items-center gap-3 lg:pb-1">
            <span className={`h-2 w-2 shrink-0 rounded-full ${statusTone.dot}`} />

            <div>
              <p className={`text-ink/35 ${tinyLabelClass}`}>{t("orders.details.status")}</p>

              <p className={`mt-1.5 text-ink/70 ${isAr ? "text-sm leading-7" : "text-sm"}`}>
                {t(`orders.status.${statusKey}`)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 h-px bg-ink/10" />
      </header>

      <CustomerOrderProgress order={order} />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20">
        <div className="min-w-0 space-y-14 sm:space-y-16">
          <section>
            <div className="mb-7 flex items-end gap-4">
              <span className={`text-plum/65 ${isAr ? "font-sans text-xl font-semibold" : "font-editorial text-2xl"}`}>
                01
              </span>

              <div className="h-px flex-1 bg-ink/10" />

              <div>
                <p className={`text-ink/35 ${smallLabelClass}`}>{t("orders.details.itemsEyebrow")}</p>

                <h2 className={`mt-1.5 text-2xl leading-tight tracking-[-0.02em] text-ink sm:text-3xl ${headingClass}`}>
                  {t("orders.details.itemsTitle")}
                </h2>
              </div>
            </div>

            <div className="border-t border-ink/15">
              {order.items.map((item) => {
                const englishTranslation = item.productName['en'];
                // const englishTranslation = item.product.translations.find((translation) => translation.locale === "en");

                const arabicTranslation = item.productName['ar'];
                // const arabicTranslation = item.product.translations.find((translation) => translation.locale === "ar");

                // const productName = locale === "ar"
                //   ? arabicTranslation?.name ?? englishTranslation?.name ?? "Product"
                //   : englishTranslation?.name ?? arabicTranslation?.name ?? "Product";

                const productName = locale === 'ar'
                  ? arabicTranslation ?? englishTranslation ?? "Product"
                  : englishTranslation ?? arabicTranslation ?? "Product";

                return (
                  <article key={item.productId + item.sizeMl} className="group flex gap-4 border-b border-ink/10 py-6 sm:gap-6 sm:py-7">
                    {(() => {
                      // const productData = item.product as typeof item.product & {
                      //   slug?: string;
                      //   imageUrl?: string | null;
                      //   images?: Array<string | {url?: string | null;}>;
                      // };

                      const productImage =
                        item.productImageUrl ??
                        "/images/products/product-placeholder.jpg";

                      // const productHref = productData.slug
                      //   ? `/products/${productData.slug}`
                      //   : "/shop";

                      const productHref = `/shop/${item.productSlug}`;

                      return (
                        <>
                          <Link href={productHref} className="group/image block shrink-0" aria-label={productName}>
                            <div className="relative h-24 w-20 overflow-hidden bg-white sm:h-28 sm:w-24">
                              <Image
                                src={productImage}
                                alt={productName}
                                fill
                                sizes="(min-width: 640px) 96px, 80px"
                                className="object-contain p-3 transition-transform duration-500 group-hover/image:scale-105"
                              />

                              <div className="pointer-events-none absolute inset-0 border border-ink/5 transition-colors duration-300 group-hover/image:border-plum/20" />
                            </div>
                          </Link>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                              <div className="min-w-0">
                                <Link href={productHref} className="group/name inline-block max-w-full">
                                  <h3 className={`wrap-break-word text-xl leading-snug tracking-[-0.015em] text-ink transition-colors duration-300 group-hover/name:text-plum sm:text-2xl ${headingClass}`}>
                                    {productName}
                                  </h3>
                                </Link>

                                <p className={`mt-2 text-ink/35 ${isAr ? "text-xs leading-6" : "text-[9px] font-semibold uppercase tracking-[0.18em]"}`}>
                                  {item.sizeMl} ml
                                </p>
                              </div>

                              <p className={`shrink-0 leading-none text-ink ${isAr ? "text-base font-semibold" : "font-editorial text-xl sm:text-2xl"}`}>
                                {formatPrice(item.subtotal, locale)}
                              </p>
                            </div>

                            <div className={`mt-5 flex flex-wrap gap-x-5 gap-y-2 text-ink/40 ${isAr ? "text-xs leading-6" : "text-[9px] font-semibold uppercase tracking-[0.16em]"}`}>
                              <span>
                                {t("orders.details.quantity")} {item.quantity}
                              </span>

                              <span className="h-1 w-1 self-center rounded-full bg-plum/40" />

                              <span>
                                {t("orders.details.unitPrice")}{" "}
                                {formatPrice(item.unitPrice, locale)}
                              </span>
                            </div>

                            <Link href={productHref} className={`mt-4 inline-flex items-center gap-2 text-plum/60 transition-colors duration-300 hover:text-plum ${isAr ? "text-xs leading-6" : "text-[9px] font-semibold uppercase tracking-[0.16em]"}`}>
                              <span>{isAr ? "عرض المنتج" : "View product"}</span>

                              <ActionArrow
                                size={13}
                                strokeWidth={1.25}
                                className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                              />
                            </Link>
                          </div>
                        </>
                      );
                    })()}
                  </article>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-7 flex items-end gap-4">
              <span className={`text-plum/65 ${isAr ? "font-sans text-xl font-semibold" : "font-editorial text-2xl"}`}>
                02
              </span>

              <div className="h-px flex-1 bg-ink/10" />

              <div>
                <p className={`text-ink/35 ${smallLabelClass}`}>{t("orders.details.deliveryEyebrow")}</p>

                <h2 className={`mt-1.5 text-2xl leading-tight tracking-[-0.02em] text-ink sm:text-3xl ${headingClass}`}>
                  {t("orders.details.deliveryTitle")}
                </h2>
              </div>
            </div>

            <div className="grid gap-x-10 gap-y-7 border-t border-ink/15 pt-7 sm:grid-cols-2">
              <DetailBlock label={t("orders.details.customer")} value={customerName || "—"} isAr={isAr} />

              <DetailBlock label={t("orders.details.phone")} value={order.customer.phone || "—"} isAr={isAr} />

              <DetailBlock label={t("orders.details.address")} value={order.deliveryAddress.address || "—"} isAr={isAr} />

              <DetailBlock label={t("orders.details.city")} value={order.deliveryAddress.city || "—"} isAr={isAr} />

              <DetailBlock label={t("orders.details.deliveryMethod")} value={t(`orders.deliveryMethods.${deliveryKey}`)} isAr={isAr} />

              {order.deliveryAddress.notes ? (
                <DetailBlock label={t("orders.details.notes")} value={order.deliveryAddress.notes} wide isAr={isAr} />
              ) : null}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="border-t-2 border-ink bg-white px-6 py-7 sm:px-7 sm:py-8">
            <p className={`text-plum ${smallLabelClass}`}>{t("orders.details.summaryEyebrow")}</p>

            <h2 className={`mt-3 text-2xl leading-tight tracking-[-0.02em] text-ink sm:text-3xl ${headingClass}`}>
              {t("orders.details.summaryTitle")}
            </h2>

            <div className="mt-8 space-y-4">
              <SummaryRow
                label={t("orders.details.items")}
                value={String(itemCount)}
                isAr={isAr}
              />

              <SummaryRow
                label={t("orders.details.subtotal")}
                value={formatPrice(order.subtotal, locale)}
                isAr={isAr}
              />

              <SummaryRow
                label={t("orders.details.delivery")}
                value={
                  isDeliveryFeeConfirmed
                    ? formatPrice(order.deliveryCost, locale)
                    : t("orders.details.deliveryFeePending")
                }
                isAr={isAr}
              />

              <div className="border-t border-ink/10 pt-5">
                <div className="flex items-end justify-between gap-5">
                  <span className={`text-ink/40 ${tinyLabelClass}`}>
                    {isDeliveryFeeConfirmed
                      ? t("orders.details.total")
                      : t("orders.details.itemsTotal")}
                  </span>

                  <span className={`text-ink ${isAr ? "text-lg font-semibold" : "font-editorial text-2xl"}`}>
                    {formatPrice(order.total, locale)}
                  </span>
                </div>

                {!isDeliveryFeeConfirmed && (
                  <p className={`mt-3 text-ink/45 ${isAr ? "text-xs leading-6" : "text-xs leading-5"}`}>
                    {t("orders.details.totalPendingDeliveryFee")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-ink/10 pt-6">
              <div>
                <p className={`text-ink/30 ${tinyLabelClass}`}>{t("orders.details.payment")}</p>

                <p className={`mt-2 text-ink/70 ${isAr ? "text-sm leading-7" : "text-sm"}`}>
                  {t("orders.details.payOnDelivery")}
                </p>
              </div>

              <div className="mt-5">
                <p className={`text-ink/30 ${tinyLabelClass}`}>{t("orders.details.paymentStatus")}</p>

                <p className={`mt-2 text-ink/70 ${isAr ? "text-sm leading-7" : "text-sm"}`}>
                  {order.paymentStatus === "paid" ? t("orders.details.paid") : t("orders.details.paymentPending")}
                </p>
              </div>
            </div>
          </div>

          <Link href="/shop" className={`group mt-6 inline-flex items-center gap-4 text-ink/45 transition-colors hover:text-plum ${isAr ? "text-sm" : "text-[10px] font-semibold uppercase tracking-[0.18em]"}`}>
            <span>{t("orders.shopNow")}</span>

            <ActionArrow size={15} strokeWidth={1.25} className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </aside>
      </div>
    </section>
  );
}

function SummaryRow({label, value, isAr}: {label: string; value: string; isAr: boolean;}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <span className={`text-ink/40 ${isAr ? "text-xs leading-6" : "text-[9px] font-semibold uppercase tracking-[0.16em]"}`}>
        {label}
      </span>

      <span className={`text-ink/70 ${isAr ? "text-sm" : "text-sm"}`}>
        {value}
      </span>
    </div>
  );
}

function DetailBlock({label, value, wide = false, isAr}: {label: string; value: string; wide?: boolean; isAr: boolean;}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className={`text-ink/35 ${isAr ? "text-xs font-medium leading-6" : "text-[9px] font-semibold uppercase tracking-[0.18em]"}`}>
        {label}
      </p>

      <p className={`mt-2.5 text-ink/70 ${isAr ? "text-sm leading-7" : "text-sm leading-6"}`}>
        {value}
      </p>
    </div>
  );
}