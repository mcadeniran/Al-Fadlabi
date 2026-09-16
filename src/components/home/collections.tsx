import {ArrowUpRight} from "lucide-react";
import {useTranslations} from "next-intl";

import {Link} from "@/i18n/navigation";

const collections = [
  {
    id: "01",
    titleKey: "signature.title",
    descriptionKey: "signature.description",
    className: "md:col-span-2",
    accent: "plum",
  },
  {
    id: "02",
    titleKey: "oud.title",
    descriptionKey: "oud.description",
    className: "",
    accent: "ink",
  },
  {
    id: "03",
    titleKey: "floral.title",
    descriptionKey: "floral.description",
    className: "",
    accent: "coral",
  },
] as const;

export function Collections() {
  const t = useTranslations("Collections");

  return (
    <section className="bg-snow px-6 py-28 text-ink sm:px-8 md:py-36 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-360">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:mb-20">
          <div>
            <p className="eyebrow mb-5 text-plum">{t("eyebrow")}</p>

            <h2 className="font-editorial text-[3.5rem] leading-[0.88] tracking-[-0.04em] sm:text-5xl md:text-6xl">
              {t("title")}
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-ink/55">{t("description")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {collections.map((collection) => (
            <Link key={collection.id} href="/collections" className={`group relative min-h-104 overflow-hidden md:min-h-124 ${collection.className}`}>
              <div className={`absolute inset-0 ${collection.accent === "plum" ? "bg-plum" : collection.accent === "coral" ? "bg-coral" : "bg-ink"}`} />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.13),transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.04),transparent_65%)] transition-transform duration-1000 group-hover:scale-105" />

              <div className="absolute inset-6 border border-white/15 transition-all duration-700 group-hover:inset-8 group-hover:border-white/30" />

              <span className="absolute left-9 top-9 text-[9px] font-medium tracking-[0.3em] text-white/60">{collection.id}</span>

              <div className="absolute right-9 top-9 h-px w-10 bg-white/35 transition-all duration-500 group-hover:w-16" />

              <div className="absolute inset-x-9 bottom-9 md:bottom-11">
                <div className="flex items-end justify-between gap-8">
                  <div>
                    <h3 className="font-editorial text-[2.8rem] leading-none tracking-[-0.035em] text-white md:text-[3.5rem]">{t(collection.titleKey)}</h3>

                    <p className="mt-4 max-w-md text-sm leading-6 text-white/60">{t(collection.descriptionKey)}</p>
                  </div>

                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-500 group-hover:-translate-y-2 group-hover:border-white group-hover:bg-white group-hover:text-ink">
                    <ArrowUpRight size={17} strokeWidth={1} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}