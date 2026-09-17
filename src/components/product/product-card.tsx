import Image from "next/image";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {Locale, useLocale, useTranslations} from "next-intl";
import type {Product} from "@/types/product";
import {useMemo} from "react";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({product}: ProductCardProps) {
  const t = useTranslations("Shop");
  const locale = useLocale() as Locale;

  const isArabic = locale === 'ar';

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(isArabic ? "ar" : "en", {
        style: "currency",
        currency: "SDG",
        maximumFractionDigits: 0,
      }),
    [isArabic],
  );

  const translation = product.translations.find((item) => item.locale === locale) ?? product.translations.find((item) => item.locale === "en");

  const name = translation?.name ?? "";
  const brand = translation?.brand ?? "";
  const primaryImage = product.images[0];

  const startingPrice = product.sizes.length > 0 ? Math.min(...product.sizes.map((size) => size.price)) : null;

  const smallestSize = product.sizes.length > 0 ? Math.min(...product.sizes.map((size) => size.ml)) : null;

  const isOutOfStock = product.sizes.length === 0 || product.sizes.every((size) => size.stockQuantity <= 0);

  const productHref = `/shop/${product.slug}`;

  return (
    <article className="group">
      {/* Product visual */}
      <Link href={productHref} className="relative block overflow-hidden bg-snow rounded-2xl">
        <div className="relative aspect-4/5 overflow-hidden">
          {primaryImage ? (
            <Image src={primaryImage.imageUrl} alt={name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 33vw, 50vw" className="object-cover transition-transform duration-900 ease-out group-hover:scale-[1.035]" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-snow" aria-hidden="true">
              <span className="text-[8px] font-medium uppercase tracking-[0.25em] text-ink/25">{t("noImage")}</span>
            </div>
          )}

          {/* Image atmosphere */}
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/20 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

          {/* New arrival */}
          {product.newArrival && (
            <span className="absolute inset-s-4 top-4 bg-plum px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-white">
              {t("newArrivals")}
            </span>
          )}

          {/* Bestseller */}
          {product.bestseller && !product.newArrival && (
            <span className="absolute inset-s-4 top-4 bg-white px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-ink">
              {t("bestsellers")}
            </span>
          )}

          {/* Out of stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/35">
              <span className="bg-white px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-ink">{t("outOfStock")}</span>
            </div>
          )}

          {/* Hover action */}
          <span aria-hidden="true" className="absolute bottom-5 inset-e-5 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-sm transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={16} strokeWidth={1.2} />
          </span>
        </div>
      </Link>

      {/* Product information */}
      <div className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-[8px] font-semibold uppercase tracking-[0.28em] text-plum">{brand}</p>

            <Link href={productHref} className="mt-2 block">
              <h3 className={`font-editorial ${isArabic ? "text-lg sm:text-xl" : "text-base sm:text-lg"}  leading-[0.95] tracking-tight text-ink transition-colors duration-300 group-hover:text-plum `}>
                {name}
              </h3>
            </Link>
          </div>

          {smallestSize !== null && (
            <span className="shrink-0 pt-1 text-[8px] font-medium uppercase tracking-[0.18em] text-ink/55">
              {smallestSize}ml+
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-ink/8 pt-3">
          <p className={`${isArabic ? "text-lg" : "text-xs"} text-ink/55`}>
            {startingPrice !== null ? (
              <>
                {t("from")}{" "}
                <span className="font-medium text-lg text-ink">
                  {currencyFormatter.format(startingPrice)}
                </span>
              </>
            ) : (
              <span className="text-ink/35">{t("priceUnavailable")}</span>
            )}
          </p>

          <span className={`${isArabic ? "text-base" : "text-sm"}  font-medium uppercase tracking-[0.18em] text-ink/30 transition-colors duration-300 group-hover:text-plum`}>
            {
              isArabic ? "عَرْض" : "View"
            }
          </span>
        </div>
      </div>
    </article>
  );
}