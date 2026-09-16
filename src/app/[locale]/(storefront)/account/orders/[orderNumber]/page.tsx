import {notFound, redirect} from "next/navigation";
import {getLocale} from "next-intl/server";

import {CustomerOrderDetails} from "@/components/account/customer-order-details";
import {createClient} from "@/lib/supabase/server";
import {getCustomerOrder} from "@/lib/orders/customer-order-service";

type OrderDetailsPageProps = {
  params: Promise<{
    locale: string;
    orderNumber: string;
  }>;
};

export default async function CustomerOrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const {orderNumber} = await params;
  const locale = await getLocale();

  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/account/login`);
  }

  const order = await getCustomerOrder(
    decodeURIComponent(orderNumber),
  );

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-snow text-ink" dir={locale === "ar" ? "rtl" : "ltr"}>
      <section className="px-6 pb-32 pt-36 sm:px-8 lg:px-12 lg:pb-40 lg:pt-44 xl:px-16">
        <div className="mx-auto max-w-360">
          <CustomerOrderDetails order={order} locale={locale} />
        </div>
      </section>
    </main>
  );
}