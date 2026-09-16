import type {Metadata} from "next";
import {notFound} from "next/navigation";
import type {Locale} from "next-intl";
import {getTranslations} from "next-intl/server";

import {Container} from "@/components/ui/container";
import {ProductGallery} from "@/components/product/product-gallery";
import {ProductPurchase} from "@/components/product/product-purchase";
import {getProductBySlug, getProductSlugs} from "@/lib/products/queries";
import type {ProductNote} from "@/types/product";

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
      <section className="px-6 pb-24 pt-32 sm:px-8 md:pb-32 lg:px-12 lg:pb-40 lg:pt-40 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className={`grid items-start gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 xl:gap-28 ${isArabic ? "lg:[direction:rtl]" : ""}`}>
            <ProductGallery product={product} />

            <div className={`flex min-w-0 flex-col lg:sticky lg:top-36 ${isArabic ? "text-right" : "text-left"}`}>
              <div className="flex items-center justify-between gap-6 border-b border-ink/10 pb-5">
                <p className="eyebrow text-plum">{brand}</p>
                <span className="text-[8px] font-medium uppercase tracking-[0.25em] text-ink/30">{genderLabel}</span>
              </div>

              <h1 className="mt-8 max-w-3xl font-editorial text-[4rem] leading-[0.82] tracking-[-0.045em] sm:text-6xl lg:text-[6.5rem]">{name}</h1>

              <p className="mt-7 max-w-xl text-[0.95rem] leading-8 text-ink/55 md:text-base md:leading-8">{description}</p>

              <div className="my-9 h-px w-full bg-ink/10" />

              <ProductPurchase product={product} />

              <div className="mt-12 border-t border-ink/10">
                <ProductDetailRow label={isArabic ? "الحجم" : "Size"} value={translation?.detailsSize ?? "—"} />
                <ProductDetailRow label={isArabic ? "التركيز" : "Concentration"} value={translation?.concentration ?? "—"} />
                <ProductDetailRow label={isArabic ? "الثبات" : "Longevity"} value={translation?.longevity ?? "—"} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {product.notes.length > 0 && (
        <section className="bg-plum px-6 py-24 text-white sm:px-8 lg:px-12 lg:py-32 xl:px-16">
          <Container className="max-w-360 px-0">
            <div className={`mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${isArabic ? "lg:[direction:rtl]" : ""}`}>
              <div>
                <p className="eyebrow text-coral">{isArabic ? "تركيبة العطر" : "The Composition"}</p>
                <h2 className="mt-5 font-editorial text-5xl leading-[0.9] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{isArabic ? "مكونات العطر" : "Fragrance Notes"}</h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-white/55">{isArabic ? "تركيبة متوازنة من النفحات المختارة بعناية لتترك أثراً يدوم." : "A considered composition of carefully selected notes designed to leave a lasting impression."}</p>
            </div>

            <div className="grid border-y border-white/15 md:grid-cols-3">
              <NoteColumn number="01" title={isArabic ? "المقدمة" : "Top Notes"} notes={topNotes} locale={locale} />
              <NoteColumn number="02" title={isArabic ? "القلب" : "Heart Notes"} notes={heartNotes} locale={locale} />
              <NoteColumn number="03" title={isArabic ? "القاعدة" : "Base Notes"} notes={baseNotes} locale={locale} />
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

function ProductDetailRow({label, value}: {label: string; value: string;}) {
  return (
    <div className="flex items-center justify-between gap-8 border-b border-ink/10 py-5">
      <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-ink/40">{label}</span>
      <span className="text-sm text-ink/70">{value}</span>
    </div>
  );
}

type NoteColumnProps = {
  number: string;
  title: string;
  notes: ProductNote[];
  locale: Locale;
};

function NoteColumn({number, title, notes, locale}: NoteColumnProps) {
  return (
    <div className="border-b border-white/15 p-8 md:border-b-0 md:border-e md:p-10 last:md:border-e-0 lg:p-12">
      <span className="text-[9px] font-semibold tracking-[0.3em] text-coral">{number}</span>
      <h3 className="mt-6 font-editorial text-3xl tracking-[-0.02em] text-white">{title}</h3>

      <div className="mt-8 space-y-4">
        {notes.length > 0 ? notes.map((note) => {
          const translation = note.translations.find((item) => item.locale === locale) ?? note.translations.find((item) => item.locale === "en");

          return (
            <div key={note.id} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0">
              <span className="text-sm text-white/65">{translation?.name ?? ""}</span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-coral" />
            </div>
          );
        }) : (
          <span className="text-sm text-white/30">—</span>
        )}
      </div>
    </div>
  );
}