import {useLocale, useTranslations} from "next-intl";

import {Link} from "@/i18n/navigation";
import Image from "next/image";

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  const isAr = locale === 'ar';

  return (
    <footer className="bg-snow px-6 pb-8 pt-20 text-ink sm:px-8 md:px-10 lg:px-16 lg:pt-24">
      <div className="mx-auto max-w-360">
        {/* =======================================================
            MAIN FOOTER
            ======================================================= */}

        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-16">
          {/* =====================================================
              BRAND
              ===================================================== */}

          <div>
            <Link
              href="/"
              aria-label="Al-Fadlabi Perfumes & Cosmetics"
              className="group inline-block">
              <Image
                src="/images/brand/al-fadlabi-logo.png"
                alt="Al-Fadlabi Perfumes & Cosmetics"
                width={180}
                height={154}
                className="h-auto w-28 object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:w-32"
              />
            </Link>

            <p className="mt-6 max-w-sm font-heading text-lg leading-relaxed text-ink/90">
              {t('brandName')}
            </p>

            <p className="mt-2 max-w-sm text-sm leading-7 text-ink/45">
              {/* {t("description")} */}
            </p>
          </div>

          {/* =====================================================
              EXPLORE
              ===================================================== */}

          <div>
            <h3 className={`mb-7 ${isAr ? "text-xl" : "text-base"} font-semibold uppercase tracking-[0.22em] text-coral`}>
              {t("explore.title")}
            </h3>

            <nav className={`flex flex-col gap-4 ${isAr ? "text-lg" : "text-sm"}  text-ink/55`}>
              <Link
                href="/"
                className="transition-colors hover:text-plum">
                {t("explore.home")}
              </Link>

              <Link
                href="/shop"
                className="transition-colors hover:text-plum">
                {t("explore.shop")}
              </Link>

              {/* <Link
                href="/collections"
                className="transition-colors hover:text-plum">
                {t("explore.collections")}
              </Link> */}

              <Link
                href="/our-story"
                className="transition-colors hover:text-plum">
                {t("explore.story")}
              </Link>
            </nav>
          </div>

          {/* =====================================================
              CLIENT
              ===================================================== */}

          <div>
            <h3 className={`mb-7 ${isAr ? "text-xl" : "text-base"} font-semibold uppercase tracking-[0.22em] text-coral`}>
              {t("client.title")}
            </h3>

            <nav className={`flex flex-col gap-4 ${isAr ? "text-lg" : "text-sm"}  text-ink/55`}>
              <Link
                href="/account"
                className="transition-colors hover:text-plum">
                {t("client.account")}
              </Link>

              <Link
                href="/account/orders"
                className="transition-colors hover:text-plum">
                {t("client.orders")}
              </Link>

              {/* <Link
                href="/contact"
                className="transition-colors hover:text-plum">
                {t("client.contact")}
              </Link> */}

              {/* <Link
                href="/faq"
                className="transition-colors hover:text-plum">
                {t("client.faq")}
              </Link> */}
            </nav>
          </div>

          {/* =====================================================
              CONTACT
              ===================================================== */}

          <div>
            <h3
              className={`mb-7 ${isAr ? "text-xl" : "text-base"} font-semibold uppercase tracking-[0.22em] text-coral`}>
              {t("contact.title")}
            </h3>

            <div className="flex flex-col gap-4 text-[0.9rem] leading-6 text-ink/55">
              <p>{t("contact.location")}</p>
              <p>{t("contact.branchOne")}</p>
              <p>{t("contact.branchTwo")}</p>

              <a
                href="mailto:mohamedaltayeb064@gmail.com"
                className="transition-colors hover:text-plum"
              >
                {t("contact.email")}
              </a>

              <a
                href="tel:+249912412592"
                className="transition-colors hover:text-plum"
              >
                {t("contact.phone")}
              </a>
            </div>
          </div>
        </div>

        {/* =======================================================
            LARGE EDITORIAL DIVIDER
            ======================================================= */}

        <div className="mt-4 h-px w-full bg-white/10 lg:mt-4" />

        {/* =======================================================
            BOTTOM
            ======================================================= */}

        <div
          className="flex flex-col gap-5 pt-7 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/30 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} PERFUME.{" "}
            {t("rights")}
          </p>

          {/* <p className="flex items-center gap-2">
            {t("madeWith")}

            <Heart
              size={11}
              strokeWidth={1}
            />
          </p> */}
        </div>
      </div>
    </footer>
  );
}
