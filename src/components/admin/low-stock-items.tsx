import Link from "next/link";
import {AlertTriangle, ArrowUpRight, PackageX, } from "lucide-react";
import {getLocale, getTranslations} from "next-intl/server";

function getStockLevel(quantity: number) {
  if (quantity <= 2) {
    return {
      label: "critical",
      bar: "bg-red-500",
      icon: "border-red-200 bg-red-50 text-red-700",
      badge: "border-red-200 bg-red-50 text-red-800",
      width: "25%",
    };
  }

  if (quantity <= 5) {
    return {
      label: "low",
      bar: "bg-amber-500",
      icon: "border-amber-200 bg-amber-50 text-amber-700",
      badge: "border-amber-200 bg-amber-50 text-amber-800",
      width: "50%",
    };
  }

  return {
    label: "watch",
    bar: "bg-yellow-400",
    icon: "border-yellow-200 bg-yellow-50 text-yellow-700",
    badge: "border-yellow-200 bg-yellow-50 text-yellow-800",
    width: "70%",
  };
}

type ProductTranslation = {
  locale: string;
  name: string;
  brand: string | null;
};

type LowStockItem = {
  id: string;
  product_id: string;
  ml: number;
  stock_quantity: number;
  products: {
    id: string;
    product_translations: ProductTranslation[];
  }[];
};

type LowStockItemsProps = {
  items: LowStockItem[];
};


export async function LowStockItems({
  items,
}: LowStockItemsProps) {
  const t = await getTranslations("AdminDashboard");
  const locale = await getLocale();

  return (
    <section className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-200/80 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
            {t('inventory')}
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
            {t("lowStock")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("lowStockDescription")}
          </p>
        </div>

        <Link
          href="/admin/inventory"
          className="group inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950"
        >
          {t("viewInventory")}

          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center p-6">
          <div className="text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-neutral-100">
              <PackageX
                className="size-5 text-neutral-500"
                strokeWidth={1.7}
              />
            </div>

            <p className="mt-3 text-sm font-medium text-neutral-900">
              {t("noLowStock")}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              {t("inventoryHealthy")}
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {items.map((item) => {
            const stock = getStockLevel(item.stock_quantity);

            const product = Array.isArray(item.products)
              ? item.products[0]
              : item.products;

            const translation = product?.product_translations.find(
              (translation) =>
                translation.locale === (locale === "ar" ? "ar" : "en"),
            );

            const productName =
              translation?.name ??
              product?.product_translations.find(
                (translation) => translation.locale === "en",
              )?.name ??
              item.product_id;

            return (
              <div
                key={item.id}
                className="px-6 py-5 transition-colors duration-200 hover:bg-neutral-50/70 sm:px-7"
              >
                <div className="flex items-start gap-3">
                  {/* Warning icon */}
                  <div
                    className={[
                      "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                      stock.icon,
                    ].join(" ")}
                  >
                    <AlertTriangle
                      className="size-4"
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Product information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-neutral-950">
                          {/* {item.product_id} */}
                          {productName}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {item.ml}ml
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={[
                            "rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                            stock.badge,
                          ].join(" ")}
                        >
                          {stock.label}
                        </span>

                        <div className="text-end">
                          <p className="text-sm font-semibold text-neutral-950">
                            {item.stock_quantity}
                          </p>

                          <p className="text-xs text-neutral-500">
                            {t("units")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stock indicator */}
                    <div className="mt-4">
                      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className={[
                            "h-full rounded-full transition-all duration-500",
                            stock.bar,
                          ].join(" ")}
                          style={{
                            width: stock.width,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
