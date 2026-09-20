import {Link} from "@/i18n/navigation";
import {ArrowRight} from "lucide-react";
import {ProductCard} from "../product";
import {Product} from "@/types/product";
import Image from "next/image";
import {BestsellerProductCard} from "../product/best-sellers-product-card";

type HomePageContentProps = {
  products: Product[];
  locale: string;
};

export function HomePageContent({
  products,
  locale,
}: HomePageContentProps) {
  const isAr = locale === "ar";

  const activeProducts = products.filter(
    (product) => product.isActive,
  );

  const featuredProducts = activeProducts
    .filter((product) => product.featured)
    .slice(0, 4);

  const bestsellerProducts = activeProducts
    .filter((product) => product.bestseller)
    .slice(0, 4);

  const newArrivalProducts = activeProducts
    .filter((product) => product.newArrival)
    .slice(0, 4);

  const headingClass = isAr
    ? "font-sans font-semibold"
    : "font-editorial";

  const bodyClass = isAr
    ? "text-[0.95rem] leading-8"
    : "text-sm leading-7";

  return (
    <div className="bg-snow text-ink">
      {/* =====================================================
          HERO
          ===================================================== */}
      <section className="relative min-h-svh overflow-hidden bg-ink">
        {/* Hero image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero_perfume.jpg"
            alt=""
            fill
            className="h-full w-full object-cover"
          />

          {/* Left-to-right readability overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/55 to-transparent" />

          {/* Bottom readability overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-ink/65 via-transparent to-ink/20" />
        </div>

        {/* Hero content */}
        <div className="relative mx-auto flex min-h-svh w-full max-w-360 items-end px-6 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24 xl:px-16">
          <div className="max-w-2xl">
            <p
              className={` font-semibold uppercase tracking-[0.24em] text-coral ${isAr
                ? "text-xl tracking-normal"
                : "text-[10px]"
                }`}
            >
              {isAr
                ? "الفاضلابي للعطور ومستحضرات التجميل"
                : "Al-Fadlabi Perfumes & Cosmetics"}
            </p>

            <h1
              className={`mt-5 max-w-xl text-[2.8rem] leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl ${headingClass}`}
            >
              {isAr
                ? "عطور تُعبّر عن حضورك"
                : "Fragrance with a presence of its own"}
            </h1>

            <p
              className={`mt-6 max-w-lg text-white/70 ${bodyClass}`}
            >
              {isAr
                ? "أكثر من ثلاثة عقود من الخبرة في العطور ومستحضرات التجميل والعناية الشخصية."
                : "More than three decades of experience in perfumes, cosmetics, and personal care."}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/shop"
                className={`button-editorial button-editorial-light ${isAr
                  ? "text-sm normal-case tracking-normal"
                  : ""
                  }`}
              >
                {isAr
                  ? "اكتشف العطور"
                  : "Discover the fragrances"}
              </Link>

              <Link
                href="/our-story"
                className={`group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65 transition-colors hover:text-white ${isAr
                  ? "text-sm normal-case tracking-normal"
                  : ""
                  }`}
              >
                <span>
                  {isAr ? "قصتنا" : "Our story"}
                </span>

                <ArrowRight
                  size={14}
                  strokeWidth={1.25}
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED
          ===================================================== */}
      {featuredProducts.length > 0 ? (
        <ProductSection
          eyebrow={
            isAr ? "مختاراتنا" : "The edit"
          }
          title={
            isAr
              ? "مختارات مميزة"
              : "Featured fragrances"
          }
          description={
            isAr
              ? "مجموعة مختارة من العطور التي تستحق أن تكون في الواجهة."
              : "A considered selection of fragrances chosen to take centre stage."
          }
          products={featuredProducts}
          locale={locale}
          headingClass={headingClass}
          bodyClass={bodyClass}
        />
      ) : null}

      {/* =====================================================
          BESTSELLERS
          ===================================================== */}
      {bestsellerProducts.length > 0 ? (
        <section className="bg-ink px-6 py-20 text-snow sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
          <div className="mx-auto max-w-360">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between md:gap-10">
              <div className="max-w-2xl">
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-coral ${isAr
                    ? "text-xs tracking-normal"
                    : ""
                    }`}
                >
                  {isAr
                    ? "الأكثر طلباً"
                    : "Most wanted"}
                </p>

                <h2
                  className={`mt-4 text-3xl leading-tight tracking-[-0.02em] text-white sm:text-4xl ${headingClass}`}
                >
                  {isAr
                    ? "الأكثر مبيعاً"
                    : "Bestsellers"}
                </h2>
              </div>

              <Link
                href="/shop"
                className={`group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white ${isAr
                  ? "text-sm normal-case tracking-normal"
                  : ""
                  }`}
              >
                <span>
                  {isAr ? "تسوق الكل" : "Shop all"}
                </span>

                <ArrowRight
                  size={14}
                  strokeWidth={1.25}
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
              {bestsellerProducts.map(
                (product) => (
                  <BestsellerProductCard
                    key={product.id}
                    product={product}
                  />
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* =====================================================
          BRAND STORY
          ===================================================== */}
      <section className="overflow-hidden bg-plum px-6 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
        <div className="mx-auto grid max-w-360 items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-coral ${isAr
                ? "text-xs tracking-normal"
                : ""
                }`}
            >
              {isAr
                ? "أكثر من ثلاثة عقود"
                : "More than three decades"}
            </p>

            <p
              className={`mt-5 text-3xl leading-tight tracking-[-0.02em] text-white sm:text-4xl ${headingClass}`}
            >
              {isAr
                ? "خبرة صنعتها السنوات، وثقة بناها الناس."
                : "Experience shaped by time. Trust built over years."}
            </p>
          </div>

          <div className="max-w-2xl lg:ms-auto">
            <p
              className={`text-white/70 ${bodyClass}`}
            >
              {isAr
                ? "منذ انطلاقتنا، حرصنا على توفير مجموعة متنوعة من العطور ومستحضرات التجميل والعناية الشخصية، مع التركيز على الجودة والتنوع والأسعار المناسبة وخدمة العملاء."
                : "Since our establishment, we have focused on providing a diverse range of perfumes, cosmetics, and personal care products, with an emphasis on quality, variety, competitive pricing, and customer service."}
            </p>

            <Link
              href="/our-story"
              className={`group mt-8 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:text-coral ${isAr
                ? "text-sm normal-case tracking-normal"
                : ""
                }`}
            >
              <span>
                {isAr
                  ? "تعرف على قصتنا"
                  : "Discover our story"}
              </span>

              <ArrowRight
                size={14}
                strokeWidth={1.25}
                className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          NEW ARRIVALS
          ===================================================== */}
      {newArrivalProducts.length > 0 ? (
        <ProductSection
          eyebrow={
            isAr ? "وصل حديثاً" : "Just arrived"
          }
          title={
            isAr
              ? "إصدارات جديدة"
              : "New arrivals"
          }
          description={
            isAr
              ? "اكتشف أحدث المنتجات التي أضيفت إلى مجموعتنا."
              : "Discover the latest additions to our selection."
          }
          products={newArrivalProducts}
          locale={locale}
          headingClass={headingClass}
          bodyClass={bodyClass}
        />
      ) : null}

      {/* =====================================================
          COLLECTION CTA
          ===================================================== */}
      <section className="bg-snow px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
        <div className="mx-auto max-w-360 border-t border-ink/10 pt-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
            <div>
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-plum ${isAr
                  ? "text-xs tracking-normal"
                  : ""
                  }`}
              >
                {isAr
                  ? "اكتشف المجموعة"
                  : "The collection"}
              </p>

              <h2
                className={`mt-4 max-w-2xl text-3xl leading-tight tracking-[-0.02em] sm:text-4xl ${headingClass}`}
              >
                {isAr
                  ? "اعثر على عطرك القادم."
                  : "Find your next signature."}
              </h2>
            </div>

            <Link
              href="/shop"
              className={`button-editorial button-editorial-primary ${isAr
                ? "text-sm normal-case tracking-normal"
                : ""
                }`}
            >
              {isAr
                ? "تسوق العطور"
                : "Shop fragrances"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductSection({
  eyebrow,
  title,
  description,
  products,
  locale,
  headingClass,
  bodyClass,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  locale: string;
  headingClass: string;
  bodyClass: string;
}) {
  const isAr = locale === "ar";

  return (
    <section className="bg-snow px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
      <div className="mx-auto max-w-360">
        <div className="grid gap-8 border-b border-ink/10 pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] text-plum ${isAr ? "text-xs tracking-normal" : ""}`}>
              {eyebrow}
            </p>

            <h2 className={`mt-4 text-3xl leading-tight tracking-[-0.02em] sm:text-4xl ${headingClass}`}>
              {title}
            </h2>
          </div>

          <p className={`max-w-xl text-ink/55 lg:ms-auto ${bodyClass}`}>
            {description}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as never} />
          ))}
        </div>
      </div>
    </section>
  );
}