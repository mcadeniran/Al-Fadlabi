// import {Hero} from "@/components/home/hero";
// import {FeaturedCollection} from "@/components/home/featured-collection";
// import {BrandStory} from "@/components/home/brand-story";
// import {Collections} from "@/components/home/collections";
// import {FinalCta} from "@/components/home/final-cta";
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
      {/* <FinalCta /> */}
    </main>
    // <main className="bg-snow text-ink">
    //   <section className="relative">
    //     < HomePageContent products={products} locale={locale} />
    //     {/* <Hero />
    //     <FeaturedCollection />
    //     <BrandStory />
    //     <Collections /> */}
    //     <FinalCta />
    //   </section>
    // </main>
  );
}