import Image from "next/image";
import {ArrowUpRight} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import type {Product} from "@/types/product";

type BestsellerProductCardProps = {
  product: Product;
};

export function BestsellerProductCard({product}: BestsellerProductCardProps) {
  const t = useTranslations("Shop");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const currencyFormatter = new Intl.NumberFormat(
    isArabic ? "ar" : "en",
    {
      style: "currency",
      currency: "SDG",
      maximumFractionDigits: 0,
    },
  );

  const translation =
    product.translations.find((item) => item.locale === locale) ??
    product.translations.find((item) => item.locale === "en");

  const name = translation?.name ?? "";
  const brand = translation?.brand ?? "";
  const primaryImage = product.images[0];

  const startingPrice =
    product.sizes.length > 0
      ? Math.min(...product.sizes.map((size) => size.price))
      : null;

  const smallestSize =
    product.sizes.length > 0
      ? Math.min(...product.sizes.map((size) => size.ml))
      : null;

  const isOutOfStock =
    product.sizes.length === 0 ||
    product.sizes.every((size) => size.stockQuantity <= 0);

  const productHref = `/shop/${product.slug}`;

  return (
    <article className="group">
      <Link href={productHref} className="relative block overflow-hidden bg-ink">
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
          {primaryImage ? (
            <Image src={primaryImage.imageUrl} alt={name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-900 ease-out group-hover:scale-[1.035] rounded-2xl" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-ink">
              <span className={`text-white/30 ${isArabic ? "text-xs" : "text-[8px] font-medium uppercase tracking-[0.25em]"}`}>
                {t("noImage")}
              </span>
            </div>
          )}

          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/55 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

          <span className={`absolute inset-s-4 top-4 bg-coral px-3 py-2 text-white ${isArabic ? "text-xs font-medium" : "text-[8px] font-semibold uppercase tracking-[0.2em]"}`}>
            {t("bestsellers")}
          </span>

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/45">
              <span className={`bg-white px-4 py-2 text-ink ${isArabic ? "text-xs font-medium" : "text-[8px] font-semibold uppercase tracking-[0.2em]"}`}>
                {t("outOfStock")}
              </span>
            </div>
          )}

          <span aria-hidden="true" className="absolute bottom-5 inset-e-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={15} strokeWidth={1.2} />
          </span>
        </div>
      </Link>

      <div className="border-b border-white/10 bg-ink px-1 pb-6 pt-5">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className={`text-coral ${isArabic ? "text-xs font-medium" : "truncate text-[8px] font-semibold uppercase tracking-[0.24em]"}`}>
              {brand}
            </p>

            <Link href={productHref} className="mt-2 block">
              <h3 className={`text-snow transition-colors duration-300 group-hover:text-coral ${isArabic ? "text-lg leading-7 font-medium" : "font-editorial text-lg leading-tight tracking-[-0.01em] sm:text-xl"}`}>
                {name}
              </h3>
            </Link>
          </div>

          {smallestSize !== null && (
            <span className={`shrink-0 pt-1 text-white/40 ${isArabic ? "text-xs" : "text-[8px] font-medium uppercase tracking-[0.16em]"}`}>
              {smallestSize}ml+
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <p className={`text-white/55 ${isArabic ? "text-sm" : "text-xs"}`}>
            {startingPrice !== null ? (
              <>
                {t("from")}{" "}
                <span className={`text-snow ${isArabic ? "text-base font-medium" : "font-medium"}`}>
                  {currencyFormatter.format(startingPrice)}
                </span>
              </>
            ) : (
              <span className="text-white/30">{t("priceUnavailable")}</span>
            )}
          </p>

          <span className={`text-white/35 transition-colors duration-300 group-hover:text-coral ${isArabic ? "text-sm" : "text-[9px] font-medium uppercase tracking-[0.18em]"}`}>
            {isArabic ? "عَرْض" : "View"}
          </span>
        </div>
      </div>
    </article>
  );
}