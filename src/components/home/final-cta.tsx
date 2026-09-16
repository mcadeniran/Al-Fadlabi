import {ArrowUpRight} from "lucide-react";
import {useTranslations} from "next-intl";

import {Link} from "@/i18n/navigation";

export function FinalCta() {
  const t = useTranslations("FinalCta");

  return (
    <section className="surface-plum relative overflow-hidden px-6 py-32 sm:px-8 md:py-40 lg:px-12 xl:px-16">
      <div aria-hidden="true" className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-coral/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl text-center">
        <p className="eyebrow mb-7 text-coral">{t("eyebrow")}</p>

        <h2 className="font-editorial text-[4rem] leading-[0.84] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
          {t("title")}
        </h2>

        <div className="mx-auto my-10 h-px w-16 bg-coral" />

        <p className="mx-auto max-w-xl text-[1rem] leading-8 text-white/65 md:text-[1.05rem]">{t("description")}</p>

        <Link href="/shop" className="button-editorial mt-10 border border-white/30 bg-white text-ink transition-colors hover:bg-snow">
          {t("cta")}
          <ArrowUpRight size={16} strokeWidth={1.2} />
        </Link>
      </div>
    </section>
  );
}