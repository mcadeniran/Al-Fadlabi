import type {Metadata} from "next";
import {notFound} from "next/navigation";
import type {Locale} from "next-intl";
import {getTranslations} from "next-intl/server";

import {Container} from "@/components/ui/container";
import {ProductGallery} from "@/components/product/product-gallery";
import {ProductPurchase} from "@/components/product/product-purchase";
import {getProductBySlug, getProductSlugs} from "@/lib/products/queries";
import type {ProductNote} from "@/types/product";
import BackButton from "./BackButton";

type ProductPageProps = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

export async function generateMetadata({params}: ProductPageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  const translation = product.translations.find((item) => item.locale === locale) ?? product.translations.find((item) => item.locale === "en");
  const name = translation?.name ?? "";
  const description = translation?.description ?? "";
  const primaryImage = product.images[0];

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      ...(primaryImage ? {images: [{url: primaryImage.imageUrl, alt: name}]} : {}),
    },
  };
}

export async function generateStaticParams() {
  const products = await getProductSlugs();

  return products.flatMap((product) =>
    (["en", "ar"] as const).map((locale) => ({
      locale,
      slug: product.slug,
    })),
  );
}

export default async function ProductPage({params}: ProductPageProps) {
  const {locale, slug} = await params;
  const product = await getProductBySlug(slug);
  const t = await getTranslations("Shop");
  const isAr = locale === 'ar';

  if (!product) {
    notFound();
  }

  const translation = product.translations.find((item) => item.locale === locale) ?? product.translations.find((item) => item.locale === "en");

  const name = translation?.name ?? "";
  const brand = translation?.brand ?? "";
  const description = translation?.description ?? "";
  const isArabic = locale === "ar";

  const topNotes = [...product.notes].filter((note) => note.type === "top").sort((a, b) => a.sortOrder - b.sortOrder);
  const heartNotes = [...product.notes].filter((note) => note.type === "heart").sort((a, b) => a.sortOrder - b.sortOrder);
  const baseNotes = [...product.notes].filter((note) => note.type === "base").sort((a, b) => a.sortOrder - b.sortOrder);

  const genderLabel = product.gender === "men" ? t("men") : product.gender === "women" ? t("women") : t("unisex");

  return (
    <main className="min-h-screen bg-snow text-ink">
      <section className="px-6 pb-20 pt-28 sm:px-8 md:pb-24 lg:px-12 lg:pb-28 lg:pt-32 xl:px-16">
        <Container className="max-w-360 px-0">
          {/* =========================================================
        BREADCRUMB
        ========================================================= */}

          <div className={`mb-8 flex items-center gap-2 ${isAr ? "text-lg" : "text-[12px]"} font-medium uppercase tracking-[0.16em] text-ink/35 lg:mb-10 ${isArabic ? "flex-row-reverse justify-start" : ""}`} >
            <BackButton />
            {/* <Link
              href="/shop"
              className="transition-colors hover:text-plum"
            >
              {isArabic ? "المتجر" : "Shop"}
            </Link> */}

            <span className="text-ink/20">/</span>

            <span className="truncate text-ink/45">
              {name}
            </span>
          </div>

          {/* =========================================================
        PRODUCT HERO
        ========================================================= */}

          <div className={`grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 xl:gap-20 ${isArabic ? "lg:[direction:rtl]" : ""}`}>
            {/* =======================================================
          GALLERY
          ======================================================= */}

            <ProductGallery product={product} />

            {/* =======================================================
          PRODUCT INFORMATION
          ======================================================= */}

            <div className={`min-w-0 lg:sticky lg:top-32 `}>
              {/* BRAND + GENDER */}

              <div className={`flex items-center justify-between gap-5 border-b border-ink/10 pb-4 ${isArabic ? "flex-row-reverse" : ""}`}>
                <p className={` ${isAr ? "text-xl" : "text-base"} text-plum`}>
                  {brand}
                </p>

                <span className={`${isAr ? "text-xl text-ink/75" : "text-base text-ink/35"} text-[12px] font-medium uppercase tracking-[0.2em] `}>
                  {genderLabel}
                </span>
              </div>

              {/* PRODUCT NAME */}

              <h1 className="mt-5 max-w-4xl font-editorial text-xl leading-[0.88] tracking-[-0.045em] sm:text-2xl lg:text-3xl xl:text-4xl">
                {name}
              </h1>

              {/* STOCK */}

              <div className={`mt-5 flex items-center gap-2 ${isArabic ? "justify-end" : ""}`}>
                <span className={`h-2 w-2 rounded-full ${product.sizes.some((size) => size.stockQuantity > 0) ? "bg-emerald-500" : "bg-ink/20"}`} />

                <span className={`font-semibold uppercase tracking-[0.2em] ${isAr ? "text-xl text-ink/80" : "text-sm text-ink/45"} `}>
                  {product.sizes.some(
                    (size) => size.stockQuantity > 0
                  )
                    ? isArabic
                      ? "متوفر"
                      : "In stock"
                    : isArabic
                      ? "غير متوفر"
                      : "Out of stock"}
                </span>
              </div>

              {/* DESCRIPTION */}

              {description && (
                <p className={`mt-6 max-w-2xl ${isAr ? "text-xl" : "text-[0.92rem]"}  leading-7 text-ink/55`}>
                  {description}
                </p>
              )}

              {/* =====================================================
                KEY DETAILS
                ===================================================== */}

              <div className="mt-7 grid grid-cols-3 divide-x divide-ink/10 border-y border-ink/10 rtl:divide-x-reverse">
                <ProductDetailCell
                  label={isArabic ? "الحجم" : "Size"}
                  value={translation?.detailsSize ?? "—"}
                  isArabic={isArabic}
                />

                <ProductDetailCell
                  label={isArabic ? "التركيز" : "Concentration"}
                  value={translation?.concentration ?? "—"}
                  isArabic={isArabic}
                />

                <ProductDetailCell
                  label={isArabic ? "الثبات" : "Longevity"}
                  value={translation?.longevity ?? "—"}
                  isArabic={isArabic}
                />
              </div>

              {/* =====================================================
                  PURCHASE
              ===================================================== */}

              <ProductPurchase product={product} />
            </div>
          </div>
        </Container>
      </section>

      {product.notes.length > 0 && (
        <section className="bg-plum px-6 py-20 text-white sm:px-8 md:py-24 lg:px-12 lg:py-28 xl:px-16">
          <Container className="max-w-360 px-0">

            <div className={`mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between ${isArabic ? "lg:[direction:rtl]" : ""}`}>
              <div className={`max-w-2xl ${isArabic ? "text-right" : "text-left"}`}>
                <p className="eyebrow text-coral">
                  {isArabic ? "تركيبة العطر" : "The Composition"}
                </p>

                <h2 className={`mt-4 font-editorial ${isAr ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl lg:text-4xl"} leading-[0.92] tracking-[-0.035em]`}>
                  {isArabic ? "مكونات العطر" : "Fragrance Notes"}
                </h2>
              </div>

              <p className={`max-w-md ${isAr ? "text-lg" : "text-sm"} leading-7 text-white/85 lg:pb-1 ${isArabic ? "text-right" : "text-left"}`}>
                {isArabic
                  ? "تركيبة متوازنة من النفحات المختارة بعناية لتترك أثراً يدوم."
                  : "A considered composition of carefully selected notes designed to leave a lasting impression."}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/15">
              <div className={`grid md:grid-cols-3 ${isArabic ? "md:[direction:rtl]" : ""}`}>
                <NoteColumn
                  number="01"
                  title={isArabic ? "المقدمة" : "Top Notes"}
                  notes={topNotes}
                  locale={locale}
                />

                <NoteColumn
                  number="02"
                  title={isArabic ? "القلب" : "Heart Notes"}
                  notes={heartNotes}
                  locale={locale}
                />

                <NoteColumn
                  number="03"
                  title={isArabic ? "القاعدة" : "Base Notes"}
                  notes={baseNotes}
                  locale={locale}
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="bg-ink px-6 py-28 text-snow sm:px-8 lg:px-12 lg:py-36 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className={`mx-auto max-w-4xl ${isArabic ? "text-right" : "text-center"}`}>
            <p className={`eyebrow text-coral ${isArabic ? "" : "text-center"}`}>{isArabic ? "صُمم بعناية" : "Crafted With Intention"}</p>
            <h2 className={`mt-7 font-editorial text-5xl leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-7xl ${isArabic ? "" : "text-center"}`}>{isArabic ? "العطر ليس مجرد رائحة." : "Fragrance is more than a scent."}</h2>
            <div className={`mt-10 h-px w-14 bg-coral ${isArabic ? "ms-0" : "mx-auto"}`} />
            <p className={`mt-9 max-w-xl text-sm leading-8 text-snow/50 lg:text-base ${isArabic ? "" : "mx-auto text-center"}`}>{isArabic ? "إنها ذكرى، إحساس، وحضور يبقى معك." : "It is memory, emotion, and presence — something that stays with you."}</p>
          </div>
        </Container>
      </section>
    </main>
  );
}

type NoteColumnProps = {
  number: string;
  title: string;
  notes: ProductNote[];
  locale: Locale;
};

function NoteColumn({number, title, notes, locale, }: NoteColumnProps) {
  const isAr = locale === 'ar';

  return (
    <div
      className="border-b border-white/15 p-7 last:border-b-0 md:border-b-0 md:border-e md:p-8 md:last:border-e-0 lg:p-10">
      {/* NUMBER */}

      <span className="text-[9px] font-semibold tracking-[0.3em] text-coral">
        {number}
      </span>

      {/* TITLE */}

      <h3 className={`mt-5 font-editorial ${isAr ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}  leading-none tracking-[-0.02em] text-white`}>
        {title}
      </h3>

      {/* NOTES */}

      <div className="mt-7">
        {notes.length > 0 ? (
          <div className="space-y-0">
            {notes.map((note) => {
              const translation =
                note.translations.find(
                  (item) => item.locale === locale
                ) ??
                note.translations.find(
                  (item) => item.locale === "en"
                );

              return (
                <div
                  key={note.id}
                  className="flex items-center justify-between gap-5 border-b border-white/10 py-3.5 last:border-b-0">
                  <span className={`${isAr ? "text-lg" : "text-sm"} text-white/75`}>
                    {translation?.name ?? ""}
                  </span>

                  <span
                    aria-hidden="true"
                    className="h-1 w-1 shrink-0 rounded-full bg-coral" />
                </div>
              );
            })}
          </div>
        ) : (
          <span className="text-sm text-white/30">
            —
          </span>
        )}
      </div>
    </div>
  );
}

function ProductDetailCell({
  label,
  value,
  isArabic,
}: {
  label: string;
  value: string;
  isArabic: boolean;
}) {
  return (
    <div
      className={`py-4 px-4 ${isArabic ? "text-right" : "text-left"}`}>
      <span className={`block ${isArabic ? "text-xl" : "text-sm"} font-semibold uppercase tracking-[0.2em] text-ink/35`}>
        {label}
      </span>

      <span className={`mt-1.5 block ${isArabic ? "text-lg" : "text-xs"} text-ink/70`}>
        {value}
      </span>
    </div>
  );
}