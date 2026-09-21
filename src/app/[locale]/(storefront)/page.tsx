import type {Metadata} from "next";
import {getLocale} from "next-intl/server";

import {HomePageContent} from "@/components/home/home-page-content";
import {getProducts} from "@/lib/products/queries";
import {OrganizationJsonLd} from "@/components/seo/organization-json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  if (locale === "ar") {
    return {
      title: "العطور ومستحضرات التجميل والعناية الشخصية",
      description:
        "اكتشف مجموعة الفاضلابي المختارة من العطور ومستحضرات التجميل ومنتجات العناية الشخصية.",
    };
  }

  return {
    title: "Perfumes, Cosmetics & Personal Care",
    description:
      "Discover Al-Fadlabi's curated collection of perfumes, cosmetics, and personal care products.",
  };
}

export default async function Home() {
  const products = await getProducts();
  const locale = await getLocale();

  return (
    <>
      <OrganizationJsonLd locale={locale === 'ar' ? 'ar' : 'en'} />

      <main className="bg-snow text-ink">
        <HomePageContent
          products={products}
          locale={locale}
        />
      </main>
    </>
  );
}
