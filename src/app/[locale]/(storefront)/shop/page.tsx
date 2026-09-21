import type {Metadata} from "next";
import {getLocale, getTranslations} from "next-intl/server";

import {ProductCard} from "@/components/product";
import {ShopToolbar} from "@/components/shop/shop-toolbar";
import {getProducts} from "@/lib/products/queries";
import type {Product} from "@/types/product";


type ShopPageProps = {
  searchParams: Promise<{
    gender?: string;
    sort?: string;
  }>;
};

const validGenders = ["women", "men", "unisex"] as const;

const validSorts = ["featured", "newest", "price-low", "price-high"] as const;

type SortOption = (typeof validSorts)[number];
type GenderFilter = (typeof validGenders)[number];

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const locale = await getLocale();
  const params = await searchParams;

  const hasFilters = Boolean(params.gender) || Boolean(params.sort);

  if (locale === "ar") {
    return {
      title: "العطور ومستحضرات التجميل",
      description:
        "تسوق مجموعة الفاضلابي من العطور ومستحضرات التجميل ومنتجات العناية الشخصية.",
      robots: {
        index: !hasFilters,
        follow: true,
      },
    };
  }

  return {
    title: "Perfumes & Cosmetics",
    description:
      "Shop Al-Fadlabi's collection of perfumes, cosmetics, and personal care products.",
    robots: {
      index: !hasFilters,
      follow: true,
    },
  };
}

export default async function ShopPage({searchParams}: ShopPageProps) {
  const products = await getProducts();
  const locale = await getLocale();
  const t = await getTranslations("Shop");
  const c = await getTranslations("OurStory");
  const params = await searchParams;

  const gender = validGenders.includes(params.gender as GenderFilter) ? (params.gender as GenderFilter) : undefined;

  const sort = validSorts.includes(params.sort as SortOption) ? (params.sort as SortOption) : "featured";

  const filteredProducts = gender ? products.filter((product) => product.gender === gender) : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      case "price-low":
        return getLowestPrice(a) - getLowestPrice(b);

      case "price-high":
        return getLowestPrice(b) - getLowestPrice(a);

      case "featured":
      default:
        return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    }
  });

  return (
    <main className="bg-snow text-ink">
      {/* Shop introduction */}
      <section className="relative overflow-hidden bg-ink text-snow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(114,19,99,0.48),transparent_42%)]" />
        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-plum/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-coral/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-360 items-end gap-16 px-6 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:pb-28 lg:pt-36">
          <div className="max-w-4xl">
            <p className={`eyebrow mb-7 text-coral ${locale === 'ar' && "mb-18"}`}>{c("hero.eyebrow")}</p>

            <h1 className="font-serif text-[clamp(3.75rem,8vw,8rem)] leading-[0.88] tracking-[-0.04em] text-snow">
              {c("hero.title")}
            </h1>

            <p className="mt-10 max-w-2xl text-lg leading-8 text-snow/70 sm:text-xl">
              {c("hero.description")}
            </p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <div className="border-l border-coral/50 pl-6 sm:pl-8">
              <p className="font-serif text-[clamp(5rem,10vw,9rem)] leading-none text-coral">
                30+
              </p>
              <p className="mt-3 max-w-55 text-sm uppercase tracking-[0.18em] text-snow/60">
                {c("hero.years")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product discovery */}
      <section className="bg-white px-6 pb-28 sm:px-8 md:pb-36 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-360">
          <ShopToolbar gender={gender ?? "all"} sort={sort} productCount={sortedProducts.length} />

          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 md:grid-cols-4 md:gap-y-20 lg:gap-x-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-96 items-center justify-center border-t border-ink/10">
              <div className="text-center">
                <p className="eyebrow mb-4 text-plum">{t("eyebrow")}</p>
                <p className="font-editorial text-4xl tracking-[-0.03em] text-ink/70">{t("noProducts")}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function getLowestPrice(product: Product) {
  return Math.min(...product.sizes.map((size) => size.price));
}