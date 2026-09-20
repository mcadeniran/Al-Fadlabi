import {HomePageContent} from "@/components/home/home-page-content";
import {getProducts} from "@/lib/products/queries";
import {getLocale} from "next-intl/server";

export default async function Home() {
  const products = await getProducts();
  const locale = await getLocale();
  return (
    <main className="bg-snow text-ink">
      <HomePageContent
        products={products}
        locale={locale}
      />
    </main>
  );
}