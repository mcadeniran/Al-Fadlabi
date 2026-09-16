import {getLocale, getTranslations} from "next-intl/server";

import {getAdminInventory, getInventoryStatus, } from "@/lib/admin/inventory";
import {InventoryStockEditor} from "@/components/admin/inventory-stock-editor";
import {InventoryFilters} from "@/components/admin/inventory-filters";

type InventoryPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    gender?: string;
    productStatus?: string;
  }>;
};

function getProductTranslation(
  translations: Array<{
    locale: "en" | "ar";
    name: string;
    brand: string;
  }>,
  locale: "en" | "ar",
) {
  return (
    translations.find(
      (translation) => translation.locale === locale,
    ) ?? translations[0]
  );
}

export default async function InventoryPage({
  searchParams,
}: InventoryPageProps) {
  const params = await searchParams;

  const [inventory, t, locale] =
    await Promise.all([
      getAdminInventory({
        search: params.search,
        status: params.status,
        gender: params.gender,
        productStatus: params.productStatus,
      }),
      getTranslations("AdminInventory"),
      getLocale(),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          {t("title")}
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          {t("description")}
        </p>
      </div>

      <InventoryFilters />

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr className="text-start text-xs font-medium uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 text-start">
                  {t("product")}
                </th>

                <th className="px-4 py-3 text-start">
                  {t("size")}
                </th>

                <th className="px-4 py-3 text-start">
                  {t("price")}
                </th>

                <th className="px-4 py-3 text-start">
                  {t("stock")}
                </th>

                <th className="px-4 py-3 text-start">
                  {t("status")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {inventory.map((item) => {
                const product = Array.isArray(item.products)
                  ? item.products[0]
                  : item.products;

                const translation =
                  getProductTranslation(
                    product?.product_translations ?? [],
                    locale === "ar" ? "ar" : "en",
                  );

                const stock = Number(
                  item.stock_quantity ?? 0,
                );

                const status =
                  getInventoryStatus(stock);

                return (
                  <tr
                    key={item.id}
                    className="text-sm"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-neutral-950">
                          {translation?.name ??
                            "Untitled product"}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {translation?.brand ?? "—"}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-neutral-700">
                      {item.ml} ml
                    </td>

                    <td className="px-4 py-4 font-medium text-neutral-900">
                      {Number(item.price).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <InventoryStockEditor
                        productSizeId={item.id}
                        stockQuantity={stock}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          status === "in_stock"
                            ? "bg-neutral-100 text-neutral-700"
                            : status === "low_stock"
                              ? "bg-neutral-200 text-neutral-800"
                              : "bg-neutral-950 text-white",
                        ].join(" ")}
                      >
                        {t(status)}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {inventory.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center"
                  >
                    <p className="text-sm font-medium text-neutral-900">
                      {t("noInventory")}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {t("noInventoryDescription")}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}