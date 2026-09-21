import {getLocale, getTranslations} from "next-intl/server";

import {ProductForm} from "@/components/admin/product-form";
import {requireAdminRole} from "@/lib/admin/auth/require-admin";

export default async function NewProductPage() {
  const t = await getTranslations("AdminProducts");

  const locale = await getLocale();

  await requireAdminRole(locale, ["owner", "admin"]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          {t("addProduct")}
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          {t("addProductDescription")}
        </p>
      </div>

      <ProductForm />
    </div>
  );
}