"use client";

import {ArrowLeft, ArrowRight} from "lucide-react";
import {Link, useRouter} from "@/i18n/navigation";
import {useLocale} from "next-intl";

import {Container} from "@/components/ui/container";
import {useCart} from "@/components/cart/cart-provider";
import {CartItem} from "@/components/cart/cart-item";
import {useMemo} from "react";
import {createClient} from "@/lib/supabase/client";

export default function CartPage() {
  const locale = useLocale();
  const {items, itemCount, subtotal, clearCart, isHydrated} = useCart();
  const isArabic = locale === "ar";
  const router = useRouter();
  const supabase = createClient();

  const handleCheckout = async () => {
    const {
      data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/account/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(isArabic ? "ar" : "en", {
        style: "currency",
        currency: "SDG",
        maximumFractionDigits: 0,
      }),
    [isArabic],
  );

  const hasUnavailableItems = items.some((item) => item.size.stockQuantity <= 0 || item.quantity > item.size.stockQuantity);

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-snow text-ink" dir={isArabic ? "rtl" : "ltr"}>
        <section className="px-6 pb-32 pt-36 sm:px-8 lg:px-12 lg:pb-40 lg:pt-44 xl:px-16">
          <Container className="max-w-360 px-0">
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-px w-10 bg-plum" />
                <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.35em] text-ink/40">{isArabic ? "جارٍ تحميل الحقيبة" : "Loading your bag"}</p>
              </div>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-snow text-ink" dir={isArabic ? "rtl" : "ltr"}>
      <section className="px-6 pb-16 pt-36 sm:px-8 md:pb-20 lg:px-12 lg:pb-24 lg:pt-44 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow text-plum">{isArabic ? "اختياراتك" : "Your Selection"}</p>
              <h1 className={`mt-5 max-w-4xl font-editorial ${isArabic ? "text-2xl sm:text-4xl lg:text-5xl" : "text-xl sm:text-3xl lg:text-5xl"}  leading-[0.84] tracking-[-0.045em]`}>
                {isArabic ? "حقيبتك" : "Your Bag"}
              </h1>
            </div>

            <div className="lg:pb-2">
              <p className={`${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.28em] text-ink/35`}>{itemCount} {isArabic ? itemCount === 1 ? "منتج" : "منتجات" : itemCount === 1 ? "item" : "items"}</p>
            </div>
          </div>

          <div className="mt-14 h-px w-full bg-ink/10" />
        </Container>
      </section>

      {items.length === 0 ? (
        <section className="px-6 pb-32 sm:px-8 lg:px-12 lg:pb-40 xl:px-16">
          <Container className="max-w-360 px-0">
            <div className="border-y border-ink/10 py-24 text-center lg:py-32">
              <p className="eyebrow text-plum">{isArabic ? "لا توجد اختيارات" : "Nothing selected"}</p>

              <h2 className="mt-6 font-editorial text-5xl leading-[0.9] tracking-[-0.035em] sm:text-6xl">{isArabic ? "حقيبتك فارغة" : "Your bag is empty"}</h2>

              <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-ink/50">{isArabic ? "اكتشف مجموعتنا من العطور المختارة بعناية." : "Discover our collection of carefully considered fragrances."}</p>

              <Link href="/shop" className="group mt-9 inline-flex h-14 items-center justify-center gap-4 bg-ink px-7 text-[9px] font-semibold uppercase tracking-[0.28em] text-snow transition-colors duration-300 hover:bg-plum">
                <span>{isArabic ? "اكتشف العطور" : "Discover Fragrance"}</span>
                {isArabic ? <ArrowLeft size={16} strokeWidth={1.25} /> : <ArrowRight size={16} strokeWidth={1.25} />}
              </Link>
            </div>
          </Container>
        </section>
      ) : (
        <section className="px-6 pb-32 sm:px-8 lg:px-12 lg:pb-40 xl:px-16">
          <Container className="max-w-360 px-0">
            <div className="grid gap-16 lg:grid-cols-[1fr_380px] lg:gap-24">
              <div>
                <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                  <span className={`${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.3em] text-ink/35`}>{isArabic ? "المنتجات" : "Items"}</span>

                  <button type="button" onClick={clearCart} className={`${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/35 transition-colors hover:text-plum`}>
                    {isArabic ? "إفراغ الحقيبة" : "Clear bag"}
                  </button>
                </div>

                <div>
                  {items.map((item) => (
                    <CartItem key={`${item.product.id}-${item.size.ml}`} item={item} />
                  ))}
                </div>

                <div className="mt-9">
                  <Link href="/shop" className={`group inline-flex items-center gap-3 ${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.28em] text-ink/45 transition-colors hover:text-plum`}>
                    {isArabic ? <ArrowRight size={14} strokeWidth={1.25} className="transition-transform group-hover:translate-x-1" /> : <ArrowLeft size={14} strokeWidth={1.25} className="transition-transform group-hover:-translate-x-1" />}
                    <span>{isArabic ? "متابعة التسوق" : "Continue Shopping"}</span>
                  </Link>
                </div>
              </div>

              <aside className="lg:sticky lg:top-32 lg:self-start">
                <div className="border-t-2 border-ink bg-white px-7 py-8 sm:px-9 sm:py-10">
                  <p className="eyebrow text-plum">{isArabic ? "ملخص الطلب" : "Order Summary"}</p>

                  <div className="mt-8">
                    <div className="flex items-baseline justify-between gap-6">
                      <span className={`${isArabic ? "text-sm" : "text-xs"}  font-semibold uppercase tracking-[0.25em] text-ink/40`}>{isArabic ? "المجموع الفرعي" : "Subtotal"}</span>
                      <div className="text-end">
                        <span className={`font-editorial ${isArabic ? "text-xl" : "text-lg"}  leading-none text-ink`}>
                          {currencyFormatter.format(subtotal)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-7 border-t border-ink/10 pt-6">
                      <div className="flex items-start justify-between gap-6">
                        <span className={`${isArabic ? "text-sm" : "text-xs"}  font-semibold uppercase tracking-[0.25em] text-ink/40`}>{isArabic ? "التوصيل" : "Delivery"}</span>
                        <span className={`max-w-37.5 text-end ${isArabic ? "text-sm" : "text-xs"}  leading-5 text-ink/40`}>{isArabic ? "يُحسب عند إتمام الطلب" : "Calculated at checkout"}</span>
                      </div>
                    </div>
                  </div>

                  {hasUnavailableItems && (
                    <div className="mt-8 border border-coral/30 bg-snow p-4">
                      <p className={`${isArabic ? "text-sm" : "text-xs"}  font-semibold uppercase tracking-[0.18em] leading-5 text-coral`}>{isArabic ? "بعض المنتجات في حقيبتك لم تعد متوفرة بالكمية المطلوبة." : "Some items in your bag are no longer available in the requested quantity."}</p>
                    </div>
                  )}

                  {items.length > 0 && !hasUnavailableItems && (
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className={`mt-9 flex h-14 w-full rounded-2xl items-center justify-center gap-4 bg-ink px-7 ${isArabic ? "text-sm" : "text-xs"
                        } font-semibold uppercase tracking-[0.28em] text-snow transition-colors duration-300 hover:bg-plum`}
                    >
                      <span
                        className={`${isArabic ? "text-sm" : "text-xs"}`}
                      >
                        {isArabic ? "إتمام الطلب" : "Proceed to Checkout"}
                      </span>

                      {isArabic ? (
                        <ArrowLeft size={16} strokeWidth={1.25} />
                      ) : (
                        <ArrowRight size={16} strokeWidth={1.25} />
                      )}
                    </button>
                  )}

                  <p className={`mt-5 text-center ${isArabic ? "text-sm" : "text-xs"}  leading-5 text-ink/30`}>{isArabic ? "الدفع متاح عند إتمام الطلب." : "Payment details are confirmed at checkout."}</p>
                </div>
              </aside>
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}