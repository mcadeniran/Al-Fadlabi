"use client";

import {useLocale} from "next-intl";

import {Link} from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();

  const nextLocale = locale === "en" ? "ar" : "en";

  return (
    <Link
      href="/"
      locale={nextLocale}
      className="
        text-[13px]
        font-medium
        uppercase
        tracking-[0.2em]
        text-ink/65
        transition-colors
        hover:text-plum
      "
    >
      {nextLocale === "ar"
        ? "العربية"
        : "English"}
    </Link>
  );
}