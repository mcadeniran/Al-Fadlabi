import {Plus} from "lucide-react";
import {getLocale, getTranslations} from "next-intl/server";

import {getAdminProducts} from "@/lib/admin/products";
import {ProductFilters} from "@/components/admin/product-filters";
import {ProductsTable} from "@/components/admin/products-table";
import {Link} from "@/i18n/navigation";
import {requireAdminRole} from "@/lib/admin/auth/require-admin";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    gender?: string;
    status?: string;
    tag?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const locale = await getLocale();

  await requireAdminRole(locale, ["owner", "admin"]);

  const products = await getAdminProducts({
    search: params.search,
    gender: params.gender,
    status: params.status,
    tag: params.tag,
  });

  const t = await getTranslations("AdminProducts");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            {t("title")}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            {t("description")}
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus className="size-4" />
          {t("addProduct")}
        </Link>
      </div>

      <ProductFilters />

      <ProductsTable products={products} />
    </div>
  );
}