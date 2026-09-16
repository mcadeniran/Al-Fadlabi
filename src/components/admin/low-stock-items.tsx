import Link from "next/link";
import {ArrowUpRight, AlertTriangle} from "lucide-react";
import {getTranslations} from "next-intl/server";

type LowStockItem = {
  id: string;
  product_id: string;
  ml: number;
  stock_quantity: number;
};

type LowStockItemsProps = {
  items: LowStockItem[];
};

export async function LowStockItems({
  items,
}: LowStockItemsProps) {
  const t = await getTranslations("AdminDashboard");

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950">
            {t("lowStock")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("lowStockDescription")}
          </p>
        </div>

        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-neutral-950"
        >
          {t("viewInventory")}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="p-6 text-sm text-neutral-500">
          {t("noLowStock")}
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {items.map((item) => {

            // const product = Array.isArray(item.products)
            //   ? item.products[0]
            //   : item.products;

            // const translation =
            //   product?.product_translations?.find(
            //     (translation) =>
            //       translation.locale === locale,
            //   ) ??
            //   product?.product_translations?.[0];

            return <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                  <AlertTriangle className="size-4 text-neutral-700" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-950">
                    {item.product_id}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {item.ml}ml
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-end">
                <p className="text-sm font-semibold text-neutral-950">
                  {item.stock_quantity}
                </p>

                <p className="text-xs text-neutral-500">
                  {t("units")}
                </p>
              </div>
            </div>;
          }
          )}
        </div>
      )}
    </section>
  );
}