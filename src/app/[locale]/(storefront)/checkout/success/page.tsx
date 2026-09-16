import {ArrowLeft, ArrowRight, Check} from "lucide-react";
import {Link} from "@/i18n/navigation";
import {Container} from "@/components/ui/container";

type CheckoutSuccessPageProps = {
  params: Promise<{
    locale: "en" | "ar";
  }>;
};

export default async function CheckoutSuccessPage({
  params,
}: CheckoutSuccessPageProps) {
  const {locale} = await params;

  const isArabic = locale === "ar";

  return (
    <main
      className="min-h-screen bg-brand-ivory text-brand-ink"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className="px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            {/* Success icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold/40">
              <Check
                size={24}
                strokeWidth={1.25}
                className="text-brand-gold"
              />
            </div>

            {/* Eyebrow */}
            <p className="mt-8 text-[9px] uppercase tracking-[0.4em] text-brand-gold">
              {isArabic ? "تم تأكيد طلبك" : "Order Confirmed"}
            </p>

            {/* Heading */}
            <h1 className="mt-5 font-heading text-5xl leading-[0.95] tracking-tight text-brand-ink sm:text-6xl">
              {isArabic ? "شكراً لطلبك" : "Thank You for Your Order"}
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-lg text-sm leading-7 text-brand-ink/55 md:text-base">
              {isArabic
                ? "تم استلام طلبك بنجاح. سنتواصل معك لتأكيد تفاصيل التوصيل."
                : "Your order has been received successfully. We will contact you to confirm your delivery details."}
            </p>

            {/* Order reference */}
            <div className="mx-auto mt-10 max-w-md border-y border-brand-ink/10 py-6">
              <p className="text-[8px] uppercase tracking-[0.3em] text-brand-ink/40">
                {isArabic ? "رقم الطلب" : "Order Reference"}
              </p>

              <p className="mt-3 font-heading text-2xl tracking-wide text-brand-ink">
                COD — CONFIRMED
              </p>
            </div>

            {/* COD notice */}
            <div className="mx-auto mt-8 max-w-md bg-brand-sand/35 p-6 text-start">
              <p className="text-[9px] uppercase tracking-[0.3em] text-brand-gold">
                {isArabic ? "الدفع عند الاستلام" : "Cash on Delivery"}
              </p>

              <p className="mt-4 text-sm leading-7 text-brand-ink/55">
                {isArabic
                  ? "سيتم دفع قيمة الطلب عند استلامه. لا يلزم إجراء أي دفع إلكتروني الآن."
                  : "Payment will be collected when your order is delivered. No online payment is required at this stage."}
              </p>
            </div>

            {/* Back to shop */}
            <div className="mt-10">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-brand-ink/55 transition-colors hover:text-brand-ink"
              >
                {isArabic ? (
                  <ArrowRight
                    size={14}
                    strokeWidth={1.25}
                    className="transition-transform group-hover:translate-x-1"
                  />
                ) : (
                  <ArrowLeft
                    size={14}
                    strokeWidth={1.25}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                )}

                {isArabic ? "العودة إلى المتجر" : "Continue Shopping"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}