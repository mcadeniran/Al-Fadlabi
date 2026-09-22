import {Link} from "@/i18n/navigation";
import {getLocale, getTranslations} from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  const locale = await getLocale();
  const isArabic = locale === "ar";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="flex min-h-[75svh] items-center bg-snow px-5 py-16 text-ink sm:px-8 lg:px-12"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Text */}
        <div className="max-w-xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />

            <p
              className={`text-xs font-medium uppercase text-ink/60 ${isArabic ? "tracking-normal" : "tracking-[0.3em]"
                }`}
            >
              {t("eyebrow")}
            </p>
          </div>

          <h1 className="font-serif text-8xl leading-none tracking-tight sm:text-9xl">
            404
          </h1>

          <h2 className="mt-6 font-serif text-3xl leading-tight sm:text-4xl">
            {t("heading")}
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-ink/60 sm:text-base">
            {t("description")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center gap-3 bg-ink px-7 py-3 text-sm font-medium text-snow transition hover:bg-ink/90"
            >
              {t("backToShop")}
              <span aria-hidden="true">
                {isArabic ? "←" : "→"}
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center border border-border px-7 py-3 text-sm font-medium transition hover:border-ink"
            >
              {t("goHome")}
            </Link>
          </div>
        </div>

        {/* Fragrance visual */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-8 rounded-full bg-[#c5a878]/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl">
            <div className="aspect-4/5">
              <div className="flex h-full flex-col items-center justify-center bg-[#eee7dc] p-8 text-center">
                <p
                  className={`text-xs uppercase text-[#8e7958] ${isArabic ? "tracking-normal" : "tracking-[0.35em]"
                    }`}
                >
                  {t("littleDetour")}
                </p>

                <div className="my-8 flex h-64 w-48 items-center justify-center rounded-t-[3rem] rounded-b-2xl border border-[#c5a878]/60 bg-linear-to-br from-[#fffdf7] via-[#e9d9b8] to-[#c5a878]/50 shadow-xl">
                  <div className="flex h-32 w-36 flex-col items-center justify-center border border-[#b29a70]/60 bg-[#f8f3e9]/90 px-3">
                    <span className="font-serif text-2xl text-ink">
                      {t("perfume")}
                    </span>

                    <span
                      className={`mt-1 text-[9px] uppercase text-ink/60 ${isArabic ? "tracking-normal" : "tracking-[0.2em]"
                        }`}
                    >
                      {t("signature")}
                    </span>
                  </div>
                </div>

                <p className="font-serif text-2xl text-ink/80">
                  {t("beauty")}
                </p>

                <p
                  className={`mt-2 text-xs text-ink/50 ${isArabic ? "tracking-normal" : "tracking-wide"
                    }`}
                >
                  {t("discover")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}