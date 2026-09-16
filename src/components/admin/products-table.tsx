import {Link} from "@/i18n/navigation";
import {ArrowUpRight} from "lucide-react";
import {getLocale, getTranslations} from "next-intl/server";
import {ProductStatusToggle} from "./product-status-toggle";
import {ProductFlagToggle} from "./product-flag-toggle";
// import Image from "next/image";
import {Product, ProductSize, ProductTranslation} from "@/types/product";

// type ProductTranslation = {
//   locale: "en" | "ar";
//   name: string;
//   brand: string;
// };

// type ProductSize = {
//   id: string;
//   ml: number;
//   price: number;
//   stock_quantity: number;
// };

// type ProductImage = {
//   id: string;
//   image_url: string;
//   sort_order: number;
// };

// type AdminProduct = {
//   id: string;
//   slug: string;
//   gender: string;
//   featured: boolean;
//   new_arrival: boolean;
//   bestseller: boolean;
//   is_active: boolean;
//   created_at: string;
//   product_translations: ProductTranslation[];
//   product_sizes: ProductSize[];
//   product_images: ProductImage[];
// };

type ProductsTableProps = {
  products: Product[];
};

export async function ProductsTable({
  products,
}: ProductsTableProps) {
  const locale = await getLocale();
  const t = await getTranslations("AdminProducts");

  const numberFormatter = new Intl.NumberFormat(
    locale === "ar" ? "ar" : "en",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );

  const getTranslation = (
    translations: ProductTranslation[],
  ) => {
    return (
      translations.find(
        (translation) => translation.locale === locale,
      ) ??
      translations.find(
        (translation) => translation.locale === "en",
      ) ??
      translations[0]
    );
  };

  const getStartingPrice = (sizes: ProductSize[]) => {
    if (sizes.length === 0) {
      return null;
    }

    return Math.min(...sizes.map((size) => Number(size.price)));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-6 py-4 text-start font-medium text-neutral-500">
                {t("product")}
              </th>
              <th className="px-6 py-4 text-start font-medium text-neutral-500">
                {t("gender")}
              </th>
              <th className="px-6 py-4 text-start font-medium text-neutral-500">
                {t("price")}
              </th>
              <th className="px-6 py-4 text-start font-medium text-neutral-500">
                {t("stock")}
              </th>
              {/* <th className="px-6 py-4 text-start font-medium text-neutral-500">
                {t("status")}
              </th> */}
              <th className="px-6 py-4 text-start font-medium text-neutral-500">
                {t("flags")}
              </th>
              <th className="px-6 py-4 text-end font-medium text-neutral-500">
                {t("action")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {products.map((product) => {
              const translation = getTranslation(
                product.translations,
              );

              const startingPrice = getStartingPrice(
                product.sizes,
              );

              const totalStock = product.sizes.reduce(
                (sum, size) =>
                  sum + Number(size.stockQuantity ?? 0),
                0,
              );

              return (
                <tr
                  key={product.id}
                  className="transition hover:bg-neutral-50"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                        {product.images[0]?.imageUrl ? (
                          <img
                            // fill
                            src={product.images[0].imageUrl}
                            alt={translation?.name ?? ""}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-neutral-400">
                            —
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-neutral-950">
                          {translation?.name ?? t("untitled")}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {translation?.brand ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="capitalize text-neutral-700">
                      {product.gender}
                    </span>
                  </td>

                  <td className="px-6 py-5 font-medium text-neutral-950">
                    {startingPrice === null
                      ? "—"
                      : numberFormatter.format(startingPrice)}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={
                        totalStock <= 5
                          ? "font-medium text-neutral-950"
                          : "text-neutral-700"
                      }
                    >
                      {numberFormatter.format(totalStock)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <ProductFlagToggle
                        productId={product.id}
                        flag="featured"
                        active={product.featured}
                      />

                      <ProductFlagToggle
                        productId={product.id}
                        flag="new_arrival"
                        active={product.newArrival}
                      />

                      <ProductFlagToggle
                        productId={product.id}
                        flag="bestseller"
                        active={product.bestseller}
                      />
                    </div>
                  </td>

                  <td className="px-6 py-5 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <ProductStatusToggle
                        productId={product.id}
                        isActive={product.isActive}
                      />

                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
                      >
                        {t("view")}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                    {/* <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
                    >
                      {t("view")}
                      <ArrowUpRight className="size-4" />
                    </Link> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="p-10 text-center">
          <p className="text-sm text-neutral-500">
            {t("noProducts")}
          </p>
        </div>
      )}
    </div>
  );
}