"use client";

import Image from "next/image";
import {useLocale} from "next-intl";

export function PremiumLoader() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <main
      className="fixed inset-0 z-9999 flex min-h-screen items-center justify-center overflow-hidden bg-snow text-ink"
      dir={isArabic ? "rtl" : "ltr"}
      aria-label={isArabic ? "جاري التحميل" : "Loading"}
      role="status"
    >
      {/* Ambient background details */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full border border-coral/10" />
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full border border-coral/10" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full border border-snow/5" />
        <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full border border-snow/5" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025),transparent_55%)]" />
      </div>

      {/* Loader content */}
      <div className="relative z-10 flex w-full max-w-xs flex-col items-center px-8">
        <div className="premium-loader-logo">
          <Image
            src="/images/brand/al-fadlabi-logo.png"
            alt="Al-Fadlabi"
            width={220}
            height={80}
            priority
            className="h-auto w-44 object-contain sm:w-52"
          />
        </div>

        <div className="mt-10 w-full max-w-45">
          <div className="relative h-px w-full overflow-hidden bg-snow/10">
            <div className="premium-loader-line absolute inset-y-0 left-0 w-1/2 bg-coral" />
          </div>
        </div>

        <p
          className={`mt-5 text-[14px] font-semibold uppercase tracking-[0.38em] text-ink ${isArabic ? "tracking-normal" : ""
            }`}
        >
          {isArabic ? "جاري التحميل" : "Loading"}
        </p>
      </div>
    </main>
  );
}