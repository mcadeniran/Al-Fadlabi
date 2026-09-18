import {redirect} from "next/navigation";
import {getLocale, getTranslations} from "next-intl/server";

import {CustomerOrders} from "@/components/account/customer-orders";
import {LogoutButton} from "@/components/account/logout-button";
import {ProfileForm} from "@/components/account/profile-form";
import {getCustomerProfile} from "@/lib/customers/customer-profile";
import {getCustomerOrders} from "@/lib/orders/customer-order-service";
import {createClient} from "@/lib/supabase/server";
import {Container} from "@/components/ui/container";

export default async function AccountPage() {
  const locale = await getLocale();
  const t = await getTranslations("Auth");

  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/account/login`);
  }

  const customer = await getCustomerProfile();

  if (!customer) {
    return (
      <main className="min-h-screen bg-snow text-ink" dir={locale === "ar" ? "rtl" : "ltr"}>
        <section className="px-6 pb-32 pt-36 sm:px-8 lg:px-12 lg:pb-40 lg:pt-44 xl:px-16">
          <Container className="max-w-360 px-0">
            <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center text-center">
              <div className="h-px w-10 bg-plum" />

              <p className="mt-8 eyebrow text-plum">
                {t("profile.missingEyebrow")}
              </p>

              <h1 className="mt-5 font-editorial text-5xl leading-[0.9] tracking-[-0.04em] sm:text-6xl">
                {t("profile.missingTitle")}
              </h1>

              <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-ink/50">
                {t("profile.missingDescription")}
              </p>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  const orders = await getCustomerOrders();

  const isArabic = locale === "ar";

  return (
    <main className="min-h-screen bg-snow text-ink" dir={isArabic ? "rtl" : "ltr"}>
      <section className="px-6 pb-20 pt-36 sm:px-8 md:pb-24 lg:px-12 lg:pb-28 lg:pt-44 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-24">
            <div>
              <p className="eyebrow text-plum">
                {t("account.eyebrow")}
              </p>

              <h1 className={`mt-5 max-w-3xl font-editorial ${isArabic ? "text-lg sm:text-2xl lg:text-4xl" : "text-base sm:text-xl lg:text- 3xl"}  leading-[0.84] tracking-tighter`}>
                {t("account.welcome", {
                  name: customer.firstName,
                })}
              </h1>
            </div>

            <div className="max-w-xl lg:justify-self-end">
              <div className="mb-6 h-px w-10 bg-coral" />

              <p className="text-sm leading-8 text-ink/50 sm:text-base">
                {t("account.description")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="px-6 pb-24 sm:px-8 lg:px-12 lg:pb-32 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className="mb-8 flex items-center gap-5">
            <span className="font-editorial text-3xl text-plum">01</span>

            <div className="h-px flex-1 bg-ink/10" />

            <p className={`eyebrow text-ink/35`}>
              {t("account.account")}
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-24">
            <ProfileForm customer={customer} />

            <aside className="lg:pt-2">
              <div className="border-t-2 border-ink pt-6">
                <p className="eyebrow text-plum">
                  {t("account.account")}
                </p>

                <div className="mt-8 space-y-7">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-ink/30">
                      {t("account.email")}
                    </p>

                    <p className="mt-3 break-all text-sm leading-6 text-ink/75">
                      {customer.email}
                    </p>
                  </div>

                  <div className="border-t border-ink/10 pt-6">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-ink/30">
                      {t("account.status")}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-plum" />

                      <p className={`${isArabic ? "text-base" : "text-sm"} text-ink/75`}>
                        {t("account.active")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-ink/10 pt-8">
                <LogoutButton />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="px-6 pb-32 sm:px-8 lg:px-12 lg:pb-40 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className="mb-8 flex items-center gap-5">
            <span className="font-editorial text-3xl text-plum">02</span>

            <div className="h-px flex-1 bg-ink/10" />

            <p className="eyebrow text-ink/35">
              {t("orders.eyebrow")}
            </p>
          </div>

          <CustomerOrders orders={orders} locale={locale} />
        </Container>
      </section>
    </main>
  );
}