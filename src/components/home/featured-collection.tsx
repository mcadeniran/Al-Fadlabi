import {ArrowUpRight} from "lucide-react";
import {useTranslations} from "next-intl";

import {Link} from "@/i18n/navigation";

const products = [
  {
    id: "01",
    nameKey: "one.name",
    descriptionKey: "one.description",
    price: "—",
    variant: "amber",
  },
  {
    id: "02",
    nameKey: "two.name",
    descriptionKey: "two.description",
    price: "—",
    variant: "ivory",
  },
  {
    id: "03",
    nameKey: "three.name",
    descriptionKey: "three.description",
    price: "—",
    variant: "rose",
  },
] as const;

function ProductAtmosphere({variant}: {variant: "amber" | "ivory" | "rose";}) {
  const atmosphere = {
    amber: "bg-[radial-gradient(circle_at_50%_42%,rgba(207,94,101,0.12),transparent_32%),linear-gradient(145deg,#262126,#151515)]",
    ivory: "bg-[radial-gradient(circle_at_50%_42%,rgba(247,246,245,0.12),transparent_30%),linear-gradient(145deg,#302b30,#181818)]",
    rose: "bg-[radial-gradient(circle_at_50%_42%,rgba(114,19,99,0.3),transparent_34%),linear-gradient(145deg,#2c1e2b,#171717)]",
  };

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden ${atmosphere[variant]}`}>
      <div aria-hidden="true" className="absolute left-1/2 top-[43%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum/10 blur-3xl" />

      <div className="relative mt-8">
        <div className="mx-auto h-8 w-16 border border-white/20 bg-ink shadow-2xl">
          <div className="mx-auto mt-2 h-4 w-9 border border-coral/25 bg-plum/20" />
        </div>

        <div className="mx-auto h-5 w-8 border-x border-white/15 bg-ink" />

        <div className="relative h-64 w-40 overflow-hidden border border-white/15 bg-linear-to-br from-[#332b31] via-[#141414] to-[#241e23] shadow-[0_30px_70px_rgba(0,0,0,0.55)] transition-transform duration-700 group-hover:-translate-y-2">
          <div className="absolute left-4 top-5 h-48 w-px bg-white/10" />

          <div className="absolute left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2 border border-white/15 px-3 py-5 text-center">
            <span className="block font-editorial text-[11px] tracking-[0.28em] text-white">PERFUME</span>
            <span className="mt-2 block text-[6px] uppercase tracking-[0.28em] text-coral">Fragrance House</span>
          </div>

          <div className="absolute bottom-5 left-1/2 h-px w-20 -translate-x-1/2 bg-coral/25" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/30 to-transparent" />
    </div>
  );
}

export function FeaturedCollection() {
  const t = useTranslations("FeaturedCollection");

  return (
    <section className="bg-snow px-6 py-24 text-ink sm:px-8 md:py-32 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-360">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end lg:mb-20">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5 text-plum">{t("eyebrow")}</p>

            <h2 className="font-editorial text-[3.5rem] leading-[0.88] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl">
              {t("title")}
            </h2>
          </div>

          <Link href="/shop" className="link-editorial w-fit text-ink/70 transition-colors hover:text-plum">
            {t("viewAll")}
            <ArrowUpRight size={15} strokeWidth={1.2} />
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link key={product.id} href={`/shop/${product.id}`} className="group block">
              <div className="relative aspect-4/5 overflow-hidden bg-ink">
                <ProductAtmosphere variant={product.variant} />

                <span className="absolute left-5 top-5 text-[9px] font-medium tracking-[0.25em] text-white/55">{product.id}</span>

                <div className="absolute bottom-5 right-5 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight size={16} strokeWidth={1.2} />
                </div>
              </div>

              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-editorial text-[1.8rem] tracking-tight">{t(product.nameKey)}</h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-ink/55">{t(product.descriptionKey)}</p>
                </div>

                <span className="pt-1 text-xs tracking-[0.08em] text-plum">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}