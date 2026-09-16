import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";

import {getAdminProduct} from "@/lib/admin/products";
import {ProductForm} from "@/components/admin/product-form";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const {id} = await params;

  const [product, t] = await Promise.all([
    getAdminProduct(id),
    getTranslations("AdminProducts"),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          {t("editProduct")}
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          {t("editProductDescription")}
        </p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}