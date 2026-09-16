import {getTranslations} from "next-intl/server";

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

export default async function ShopPage({searchParams}: ShopPageProps) {
  const products = await getProducts();
  const t = await getTranslations("Shop");
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
      <section className="relative overflow-hidden bg-snow px-6 pb-20 pt-32 sm:px-8 md:pb-28 lg:px-12 lg:pt-40 xl:px-16">
        <div aria-hidden="true" className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-plum/5 blur-3xl" />

        <div className="relative mx-auto max-w-360">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.65fr]">
            <div>
              <p className="eyebrow mb-6 text-plum">{t("eyebrow")}</p>

              <h1 className="max-w-4xl font-editorial text-[4rem] leading-[0.84] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[7rem]">
                {t("title")}
              </h1>
            </div>

            <div className="max-w-md lg:justify-self-end">
              <p className="text-[1rem] leading-8 text-ink/55 md:text-[1.05rem]">{t("description")}</p>
            </div>
          </div>

          <div className="mt-14 h-px w-full bg-ink/10 md:mt-20" />

          <div className="mt-5 flex items-center justify-between gap-6">
            <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-ink/35">Perfume House</span>

            <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-plum">Collection / 01</span>
          </div>
        </div>
      </section>

      {/* Product discovery */}
      <section className="bg-white px-6 pb-28 sm:px-8 md:pb-36 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-360">
          <ShopToolbar gender={gender ?? "all"} sort={sort} productCount={sortedProducts.length} />

          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 md:grid-cols-3 md:gap-y-20 lg:gap-x-8">
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