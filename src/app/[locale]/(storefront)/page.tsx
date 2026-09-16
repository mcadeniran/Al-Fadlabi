import {Hero} from "@/components/home/hero";
import {FeaturedCollection} from "@/components/home/featured-collection";
import {BrandStory} from "@/components/home/brand-story";
import {Collections} from "@/components/home/collections";
import {FinalCta} from "@/components/home/final-cta";

export default async function Home() {
  return (
    <main className="bg-snow text-ink">
      <section className="relative">
        <Hero />
        <FeaturedCollection />
        <BrandStory />
        <Collections />
        <FinalCta />
      </section>
    </main>
  );
}