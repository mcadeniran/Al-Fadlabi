"use client";

import Image from "next/image";
import {useEffect, useMemo, useState} from "react";
import {Link} from "@/i18n/navigation";
import {useLocale} from "next-intl";
import {ArrowLeft, ArrowRight, Check, Loader2, Package} from "lucide-react";
import {useSearchParams} from "next/navigation";

import {Container} from "@/components/ui/container";
import {createClient} from "@/lib/supabase/client";

type SupabaseOrderItem = {
  id: string;
  product_id: string | null;
  product_size_id: string | null;
  product_name: Record<string, string>;
  product_image_url: string | null;
  size_ml: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

type SupabaseOrder = {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  payment_status: string;
  delivery_method: "standard" | "express";
  subtotal: number;
  delivery_fee: number;
  total: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  notes: string | null;
  created_at: string;
  items: SupabaseOrderItem[];
};

export default function OrderConfirmationPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();

  const orderNumber = searchParams.get("order");
  const guestToken = searchParams.get("token");

  const [order, setOrder] = useState<SupabaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isArabic = locale === "ar";

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(isArabic ? "ar" : "en", {
        style: "currency",
        currency: "SDG",
        maximumFractionDigits: 0,
      }),
    [isArabic],
  );

  useEffect(() => {
    async function loadOrder() {
      if (!orderNumber) {
        setError(isArabic ? "لم يتم العثور على رقم الطلب." : "No order number was provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const supabase = createClient();

        if (guestToken) {
          const {data, error: guestError} = await supabase.rpc("get_guest_order", {
            p_order_number: orderNumber,
            p_guest_access_token: guestToken,
          });

          if (guestError) {
            throw guestError;
          }

          setOrder(data as SupabaseOrder);
          return;
        }

        const {data, error: orderError} = await supabase
          .from("orders")
          .select(
            `
              id,
              order_number,
              status,
              payment_method,
              payment_status,
              delivery_method,
              subtotal,
              delivery_fee,
              total,
              customer_name,
              customer_phone,
              delivery_address,
              delivery_city,
              notes,
              created_at,
              order_items (
                id,
                product_id,
                product_size_id,
                product_name,
                product_image_url,
                size_ml,
                quantity,
                unit_price,
                subtotal
              )
            `,
          )
          .eq("order_number", orderNumber)
          .maybeSingle();

        if (orderError) {
          throw orderError;
        }

        if (!data) {
          throw new Error("ORDER_NOT_FOUND");
        }

        setOrder({
          id: data.id,
          order_number: data.order_number,
          status: data.status,
          payment_method: data.payment_method,
          payment_status: data.payment_status,
          delivery_method: data.delivery_method,
          subtotal: data.subtotal,
          delivery_fee: data.delivery_fee,
          total: data.total,
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          delivery_address: data.delivery_address,
          delivery_city: data.delivery_city,
          notes: data.notes,
          created_at: data.created_at,
          items: (data.order_items ?? []) as SupabaseOrderItem[],
        });
      } catch (loadError) {
        console.error("Failed to load order:", loadError);

        setError(isArabic ? "تعذر العثور على هذا الطلب." : "We could not find this order.");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [guestToken, isArabic, orderNumber]);

  if (loading) {
    return (
      <main className="min-h-screen bg-snow text-ink" dir={isArabic ? "rtl" : "ltr"}>
        <section className="px-6 pb-32 pt-36 sm:px-8 lg:px-12 lg:pb-40 lg:pt-44 xl:px-16">
          <Container className="max-w-360 px-0">
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-px w-10 bg-plum" />
                <Loader2 className="mx-auto mt-7 h-5 w-5 animate-spin text-ink/35" />
                <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.32em] text-ink/35">
                  {isArabic ? "جاري تحميل تفاصيل طلبك" : "Loading your order"}
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-snow text-ink" dir={isArabic ? "rtl" : "ltr"}>
        <section className="px-6 pb-32 pt-36 sm:px-8 lg:px-12 lg:pb-40 lg:pt-44 xl:px-16">
          <Container className="max-w-360 px-0">
            <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center border border-ink/15 bg-white">
                <Package className="h-6 w-6 text-ink/45" strokeWidth={1.25} />
              </div>

              <p className="mt-8 eyebrow text-plum">
                {isArabic ? "تعذر الوصول" : "Unable to Continue"}
              </p>

              <h1 className="mt-5 font-editorial text-5xl leading-[0.9] tracking-[-0.04em] sm:text-6xl">
                {isArabic ? "لم يتم العثور على الطلب" : "Order Not Found"}
              </h1>

              <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-ink/50">
                {isArabic
                  ? "قد يكون رابط الطلب غير صالح أو لم يعد متاحاً."
                  : "The order link may be invalid or the order may no longer be available."}
              </p>

              <Link
                href="/shop"
                className="button-editorial button-editorial-primary mt-9 inline-flex"
              >
                {isArabic ? "العودة إلى المتجر" : "Return to Shop"}
              </Link>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-snow text-ink" dir={isArabic ? "rtl" : "ltr"}>
      <section className="px-6 pb-20 pt-36 sm:px-8 md:pb-24 lg:px-12 lg:pb-28 lg:pt-44 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className="grid  rounded-2xl  overflow-hidden bg-plum lg:grid-cols-[0.72fr_1.28fr]">
            <div className="relative flex min-h-80 flex-col justify-between overflow-hidden p-8 text-snow sm:p-10 lg:min-h-107.5 lg:p-14 xl:p-16">
              <div className="absolute -inset-e-20 -top-20 h-64 w-64 rounded-full border border-coral/20" />
              <div className="absolute -inset-e-10 -top-10 h-44 w-44 rounded-full border border-coral/20" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-snow/20 bg-snow/5">
                  <Check className="h-5 w-5 text-coral" strokeWidth={1.5} />
                </div>

                <p className={`mt-8 ${isArabic ? "text-lg" : "text-base"} font-semibold uppercase tracking-[0.32em] text-coral`}>
                  {isArabic ? "تم تأكيد الطلب" : "Order Confirmed"}
                </p>

                <h1 className={`mt-5 max-w-xl font-editorial ${isArabic ? "text-lg sm:text-2xl lg:text-4xl" : "text-base sm:text-xl lg:text-2xl"} leading-[0.86] tracking-[-0.04em]`}>
                  {isArabic ? "شكراً لطلبك" : "Thank You"}
                </h1>
              </div>

              <div className="relative mt-12">
                <p className="max-w-sm text-sm leading-7 text-snow/65">
                  {isArabic
                    ? "تم استلام طلبك بنجاح. سنتواصل معك لتأكيد تفاصيل التوصيل."
                    : "Your order has been received. We will contact you to confirm your delivery details."}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-ink p-8 text-snow sm:p-10 lg:p-14 xl:p-16">
              <div>
                <p className={`${isArabic ? "text-base" : "text-sm"} font-semibold uppercase tracking-[0.32em] text-snow/35`}>
                  {isArabic ? "رقم الطلب" : "Order Number"}
                </p>

                <p className="mt-4 break-all font-editorial text-4xl leading-none tracking-[-0.02em] text-snow sm:text-5xl">
                  {order.order_number}
                </p>
              </div>

              <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:mt-20">
                <div>
                  <p className={`${isArabic ? "text-base" : "text-sm"} font-semibold uppercase tracking-[0.28em] text-snow/30`}>
                    {isArabic ? "الحالة" : "Status"}
                  </p>

                  <p className={`${isArabic ? "text-lg" : "text-base"} mt-3 text-snow/80`}>
                    {getStatusLabel(order.status, isArabic)}
                  </p>
                </div>

                <div>
                  <p className={`${isArabic ? "text-base" : "text-sm"} font-semibold uppercase tracking-[0.28em] text-snow/30`}>
                    {isArabic ? "الدفع" : "Payment"}
                  </p>

                  <p className={`mt-3 ${isArabic ? "text-lg" : "text-base"} text-snow/80`}>
                    {isArabic ? "الدفع عند الاستلام" : "Pay on Delivery"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="px-6 pb-32 sm:px-8 lg:px-12 lg:pb-40 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className="grid gap-16 lg:grid-cols-[1fr_380px] lg:gap-24">
            <section>
              <div className="flex items-end justify-between border-b border-ink/10 pb-5">
                <div>
                  <p className="eyebrow text-plum">
                    {isArabic ? "اختياراتك" : "Your Selection"}
                  </p>

                  <h2 className={`mt-4 font-editorial  leading-[0.9] tracking-[-0.035em] ${isArabic ? "text-xl sm:text-3xl" : "text-lg sm:text-2xl"}`}>
                    {isArabic ? "تفاصيل الطلب" : "Your Order"}
                  </h2>
                </div>

                <p className="pb-1 text-[12px] font-semibold uppercase tracking-[0.25em] text-ink/30">
                  {order.items.length}{" "}
                  {isArabic
                    ? order.items.length === 1
                      ? "منتج"
                      : "منتجات"
                    : order.items.length === 1
                      ? "Item"
                      : "Items"}
                </p>
              </div>

              <div>
                {order.items.map((item) => (
                  <article
                    key={item.id}
                    className="flex gap-5 border-b border-ink/10 py-7 sm:gap-7 sm:py-8"
                  >
                    <div className="relative h-28 w-24 shrink-0 rounded-2xl overflow-hidden bg-white sm:h-36 sm:w-28">
                      {item.product_image_url ? (
                        <Image
                          src={item.product_image_url}
                          alt={getProductName(item, locale)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 96px, 112px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-snow">
                          <Package className="h-5 w-5 text-ink/20" strokeWidth={1.25} />
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <h3 className={`font-editorial ${isArabic ? "text-lg sm:text-2xl" : "text-base sm:text-xl"} leading-[0.95] tracking-[-0.02em]`}>
                          {getProductName(item, locale)}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-ink/35">
                          <span>{item.size_ml}ml</span>
                          <span className="h-1 w-1 rounded-full bg-plum/50" />
                          <span>
                            {isArabic ? "الكمية" : "Qty"} {item.quantity}
                          </span>
                        </div>
                      </div>

                      <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink/40">
                        {currencyFormatter.format(item.unit_price)}{" "}
                        {isArabic ? "للوحدة" : "each"}
                      </p>
                    </div>

                    <div className="shrink-0 text-end">
                      <p className={`font-editorial ${isArabic ? "text-lg sm:text-xl" : "text-base sm:text-lg"} leading-none`}>
                        {currencyFormatter.format(item.subtotal)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="border-t-2 border-ink bg-white px-7 py-8 sm:px-9 sm:py-10">
                <p className="eyebrow text-plum">
                  {isArabic ? "الملخص" : "The Summary"}
                </p>

                <div className="mt-8 space-y-5">
                  <SummaryRow
                    label={isArabic ? "المجموع الفرعي" : "Subtotal"}
                    value={currencyFormatter.format(order.subtotal)}
                    isArabic
                  />

                  <SummaryRow
                    label={isArabic ? "التوصيل" : "Delivery"}
                    value={currencyFormatter.format(order.delivery_fee)}
                    isArabic
                  />

                  <div className="border-t border-ink/10 pt-6">
                    <SummaryRow
                      label={isArabic ? "الإجمالي" : "Total"}
                      value={currencyFormatter.format(order.total)}
                      emphasized
                      isArabic
                    />
                  </div>
                </div>

                <div className="mt-8 border-t border-ink/10 pt-7">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-ink/30">
                      {isArabic ? "طريقة الدفع" : "Payment Method"}
                    </p>

                    <p className="mt-3 text-sm text-ink/75">
                      {isArabic ? "الدفع عند الاستلام" : "Pay on Delivery"}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-ink/30">
                      {isArabic ? "طريقة التوصيل" : "Delivery Method"}
                    </p>

                    <p className="mt-3 text-sm text-ink/75">
                      {getDeliveryMethodLabel(order.delivery_method, isArabic)}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-ink px-6 py-20 text-snow sm:px-8 lg:px-12 lg:py-24 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="eyebrow text-coral">
                {isArabic ? "التوصيل" : "Delivery"}
              </p>

              <h2 className="mt-5 font-editorial text-xl leading-[0.9] tracking-[-0.035em] sm:text-3xl">
                {isArabic ? "إلى أين نتجه؟" : "Where We're Sending It"}
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <DetailBlock
                label={isArabic ? "الاسم" : "Name"}
                value={order.customer_name}
                dark
                isArabic
              />

              <DetailBlock
                label={isArabic ? "الهاتف" : "Phone"}
                value={order.customer_phone}
                dark
                isArabic
              />

              <DetailBlock
                label={isArabic ? "العنوان" : "Address"}
                value={`${order.delivery_address}, ${order.delivery_city}`}
                dark
                isArabic
              />

              {order.notes && (
                <DetailBlock
                  label={isArabic ? "ملاحظات" : "Notes"}
                  value={order.notes}
                  dark
                  isArabic
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className="flex flex-col items-center text-center">
            <div className="h-px w-10 bg-coral" />

            <p className="mt-7 eyebrow text-plum">
              {isArabic ? "نراك قريباً" : "Until Next Time"}
            </p>

            <h2 className={`mt-5 font-editorial leading-[0.88] tracking-[-0.04em] max-w-2xl ${isArabic ? "text-lg  sm:text-xl lg:text-4xl" : "text-lg  sm:text-xl lg:text-2xl"} `}>
              {isArabic
                ? "عطرك، قصتك."
                : "Let your fragrance tell the story."}
            </h2>

            <p className="mt-7 max-w-md text-sm leading-7 text-ink/45">
              {isArabic
                ? "استكشف المزيد من العطور واكتشف ما يناسبك."
                : "Continue exploring the collection and discover what comes next."}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row text-2xl">
              <Link
                href="/shop"
                className="button-editorial  button-editorial-primary inline-flex items-center justify-center gap-4"
              >
                <span>{isArabic ? "متابعة التسوق" : "Continue Shopping"}</span>
                {isArabic ? (
                  <ArrowLeft size={15} strokeWidth={1.25} />
                ) : (
                  <ArrowRight size={15} strokeWidth={1.25} />
                )}
              </Link>

              <Link
                href="/account"
                className="button-editorial button-editorial-secondary inline-flex items-center justify-center"
              >
                {isArabic ? "حسابي" : "My Account"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  emphasized = false,
  isArabic
}: {
  label: string;
  value: string;
  emphasized?: boolean;
  isArabic: boolean;
}) {
  return (
    <div className={emphasized ? "flex items-end justify-between gap-6" : "flex items-center justify-between gap-6"}>
      <span className={emphasized ? `${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/45` : `${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.22em] text-ink/40`}>
        {label}
      </span>

      <span className={emphasized ? "font-editorial text-2xl leading-none text-ink" : "text-lg text-ink/75"}>
        {value}
      </span>
    </div>
  );
}

function DetailBlock({
  label,
  value,
  dark = false,
  isArabic
}: {
  label: string;
  value: string;
  dark?: boolean;
  isArabic: boolean;
}) {
  return (
    <div className={dark ? "border-t border-snow/10 pt-5" : "border-t border-ink/10 pt-5"}>
      <p className={dark ? `${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-snow/30` : `${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/30`}>
        {label}
      </p>

      <p className={dark ? `mt-3 ${isArabic ? "text-base" : "text-sm"} leading-7 text-snow/75` : `mt-3 ${isArabic ? "text-base" : "text-sm"} leading-7 text-ink/75`}>
        {value}
      </p>
    </div>
  );
}

function getProductName(
  item: SupabaseOrderItem,
  locale: string,
) {
  return (
    item.product_name?.[locale] ??
    item.product_name?.en ??
    item.product_name?.ar ??
    "Perfume"
  );
}

function getDeliveryMethodLabel(
  method: "standard" | "express",
  isArabic: boolean,
) {
  if (method === "express") {
    return isArabic ? "توصيل سريع" : "Express Delivery";
  }

  return isArabic ? "توصيل عادي" : "Standard Delivery";
}

function getStatusLabel(
  status: string,
  isArabic: boolean,
) {
  switch (status) {
    case "pending":
      return isArabic ? "قيد المعالجة" : "Processing";

    case "confirmed":
      return isArabic ? "تم التأكيد" : "Confirmed";

    case "processing":
      return isArabic ? "قيد التجهيز" : "Being Prepared";

    case "shipped":
      return isArabic ? "تم الشحن" : "Shipped";

    case "delivered":
      return isArabic ? "تم التسليم" : "Delivered";

    case "cancelled":
      return isArabic ? "ملغي" : "Cancelled";

    default:
      return status;
  }
}