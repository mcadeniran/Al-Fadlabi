import {ArrowUpRight} from "lucide-react";
import {useTranslations} from "next-intl";

import {Link} from "@/i18n/navigation";

export function BrandStory() {
  const t = useTranslations("BrandStory");

  return (
    <section className="surface-ink px-6 py-28 sm:px-8 md:py-36 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-360">
        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          {/* Editorial visual */}
          <div className="relative mx-auto aspect-4/5 w-full max-w-lg overflow-hidden bg-plum">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.12),transparent_32%),linear-gradient(145deg,#721363,#54104a)]" />

            <div className="absolute inset-6 border border-white/15 md:inset-8" />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="block font-editorial text-[7rem] leading-none text-white/90 md:text-[9rem]">P</span>

              <span className="mt-5 block text-[8px] uppercase tracking-[0.42em] text-coral">{t("monogram")}</span>
            </div>

            <span className="absolute bottom-7 left-7 text-[9px] tracking-[0.3em] text-white/50">08 — 26</span>

            <span className="absolute right-7 top-1/2 hidden -translate-y-1/2 rotate-90 text-[8px] uppercase tracking-[0.4em] text-white/45 sm:block">
              {t("verticalLabel")}
            </span>
          </div>

          {/* Story */}
          <div>
            <p className="eyebrow mb-6 text-coral">{t("eyebrow")}</p>

            <h2 className="max-w-3xl font-editorial text-[3.8rem] leading-[0.88] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {t("title")}
            </h2>

            <div className="my-10 h-px w-16 bg-coral/70" />

            <p className="max-w-xl text-[1rem] leading-8 text-white/60 md:text-[1.05rem]">{t("description")}</p>

            <Link href="/our-story" className="button-editorial mt-10 border border-white/30 bg-transparent text-white transition-colors hover:border-coral hover:bg-coral hover:text-white">
              {t("cta")}
              <ArrowUpRight size={15} strokeWidth={1.2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}