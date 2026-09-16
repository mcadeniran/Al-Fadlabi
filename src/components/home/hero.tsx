import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {ArrowDown, ArrowRight, ArrowUpRight} from "lucide-react";
import heroPerfume from '../../../public/images/p3.jpeg';
import {getTranslations} from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative min-h-svh overflow-hidden bg-ink text-white">
      {/* Atmospheric plum wash */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(114,19,99,0.42),transparent_34%),radial-gradient(circle_at_20%_85%,rgba(207,94,101,0.08),transparent_30%)]" />

      {/* Subtle image veil */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,25,25,0.94)_0%,rgba(25,25,25,0.76)_38%,rgba(25,25,25,0.12)_75%,rgba(25,25,25,0.2)_100%)]" />

      <div className="relative mx-auto flex min-h-svh max-w-360 items-center px-6 pb-20 pt-32 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          {/* Editorial copy */}
          <div className="relative z-10 max-w-2xl">
            <p className="eyebrow mb-7 text-coral">{t("eyebrow")}</p>

            <h1 className="max-w-3xl whitespace-pre-line font-editorial text-[4.4rem] leading-[0.84] tracking-[-0.045em] text-white sm:text-[5.5rem] md:text-[6.5rem] lg:text-[6.8rem] xl:text-[7.6rem]">
              {t("title")}
            </h1>

            <div className="my-9 h-px w-16 bg-coral/70" />

            <p className="max-w-lg text-[1rem] leading-8 text-white/65 sm:text-[1.05rem]">
              {t("description")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-7">
              <Link href="/collections" className="button-editorial button-editorial-light group gap-4">
                {t("cta")}
                <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link href="/our-story" className="link-editorial text-white/70 transition-colors hover:text-coral">
                Our story
                <ArrowUpRight size={14} strokeWidth={1.3} />
              </Link>
            </div>
          </div>

          {/* Hero photography */}
          <div className="relative mx-auto w-full max-w-155 lg:ml-auto">
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum/35 blur-[110px]" />

            <div className="relative aspect-4/5 w-full overflow-hidden">
              <Image src={heroPerfume} alt={t("imageAlt")} fill priority sizes="(max-width: 1024px) 90vw, 620px" className="object-cover object-center transition-transform duration-1400 hover:scale-[1.025]" />

              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,25,25,0.02)_20%,rgba(25,25,25,0.22)_100%)]" />

              <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-ink/45 to-transparent" />

              <div aria-hidden="true" className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-white/20 pt-4">
                <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/65">Eau de Parfum</span>
                <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-coral">01 / 03</span>
              </div>
            </div>

            <div className="absolute -bottom-7 -left-7 hidden h-28 w-28 border-l border-b border-coral/50 lg:block" />
            <div className="absolute -right-5 -top-5 hidden h-20 w-20 border-r border-t border-white/15 lg:block" />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
        <span className="text-[9px] font-medium uppercase tracking-[0.38em] text-white/45">{t("scroll")}</span>
        <ArrowDown size={15} strokeWidth={1} className="animate-bounce text-coral/70" />
      </div>
    </section>
  );
}