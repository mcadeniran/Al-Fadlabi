import {getTranslations} from "next-intl/server";
import Link from "next/link";
import {ArrowRight, Check} from "lucide-react";

type OurStoryPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function OurStoryPage({
  params,
}: OurStoryPageProps) {
  const {locale} = await params;
  const t = await getTranslations("OurStory");

  // const isArabic = locale === "ar";
  // const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const offerings = [
    {
      number: "01",
      title: t("offerings.perfumes.title"),
      description: t("offerings.perfumes.description"),
    },
    {
      number: "02",
      title: t("offerings.cosmetics.title"),
      description: t("offerings.cosmetics.description"),
    },
    {
      number: "03",
      title: t("offerings.soap.title"),
      description: t("offerings.soap.description"),
    },
    {
      number: "04",
      title: t("offerings.sourcing.title"),
      description: t("offerings.sourcing.description"),
    },
    {
      number: "05",
      title: t("offerings.trading.title"),
      description: t("offerings.trading.description"),
    },
    {
      number: "06",
      title: t("offerings.service.title"),
      description: t("offerings.service.description"),
    },
  ];

  const commitments = [
    t("commitment.quality"),
    t("commitment.variety"),
    t("commitment.pricing"),
    t("commitment.availability"),
    t("commitment.service"),
    t("commitment.relationships"),
  ];

  return (
    <main className="bg-snow">
      <section className="relative overflow-hidden bg-ink text-snow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(114,19,99,0.48),transparent_42%)]" />
        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-plum/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-coral/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-360 items-end gap-16 px-6 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:pb-28 lg:pt-36">
          <div className="max-w-4xl">
            <p className="eyebrow mb-7 text-coral">{t("hero.eyebrow")}</p>

            <h1 className="font-serif text-[clamp(3.75rem,8vw,8rem)] leading-[0.88] tracking-[-0.04em] text-snow">
              {t("hero.title")}
            </h1>

            <p className="mt-10 max-w-2xl text-lg leading-8 text-snow/70 sm:text-xl">
              {t("hero.description")}
            </p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <div className="border-l border-coral/50 pl-6 sm:pl-8">
              <p className="font-serif text-[clamp(5rem,10vw,9rem)] leading-none text-coral">
                30+
              </p>
              <p className="mt-3 max-w-55 text-sm uppercase tracking-[0.18em] text-snow/60">
                {t("hero.years")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-snow">
        <div className="mx-auto max-w-360 px-6 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
            <div>
              <p className="eyebrow text-plum">{t("story.eyebrow")}</p>
              <h2 className="mt-5 max-w-md font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-ink sm:text-6xl">
                {t("story.title")}
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-xl leading-9 text-ink sm:text-2xl sm:leading-10">
                {t("story.paragraph1")}
              </p>

              <p className="mt-8 text-base leading-8 text-ink/65 sm:text-lg sm:leading-9">
                {t("story.paragraph2")}
              </p>

              <p className="mt-8 text-base leading-8 text-ink/65 sm:text-lg sm:leading-9">
                {t("story.paragraph3")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-360 px-6 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          <div className="flex flex-col gap-6 border-b border-ink/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-plum">{t("offerings.eyebrow")}</p>
              <h2 className="mt-5 font-serif text-5xl leading-none tracking-[-0.03em] text-ink sm:text-6xl">
                {t("offerings.title")}
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-ink/55 sm:text-right">
              {t("offerings.introduction")}
            </p>
          </div>

          <div className="mt-4">
            {offerings.map((offering) => (
              <article
                key={offering.number}
                className="group grid gap-5 border-b border-ink/10 py-8 sm:grid-cols-[80px_0.8fr_1.2fr] sm:items-start sm:gap-8 sm:py-10"
              >
                <span className="text-xs font-medium tracking-[0.2em] text-coral">
                  {offering.number}
                </span>

                <h3 className="font-serif text-3xl leading-none text-ink transition-colors duration-300 group-hover:text-plum sm:text-4xl">
                  {offering.title}
                </h3>

                <p className="max-w-2xl text-sm leading-7 text-ink/60 sm:text-base sm:leading-8">
                  {offering.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-plum text-snow">
        <div className="mx-auto max-w-360 px-6 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="eyebrow text-coral">{t("growth.eyebrow")}</p>

              <h2 className="mt-5 max-w-xl font-serif text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                {t("growth.title")}
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-xl leading-9 text-snow/90 sm:text-2xl sm:leading-10">
                {t("growth.paragraph")}
              </p>

              <div className="mt-12 border-t border-snow/15 pt-8">
                <p className="text-sm uppercase tracking-[0.18em] text-coral">
                  {t("growth.caption")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-snow">
        <div className="mx-auto max-w-360 px-6 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="eyebrow text-plum">{t("commitment.eyebrow")}</p>

              <h2 className="mt-5 max-w-lg font-serif text-5xl leading-[0.94] tracking-[-0.03em] text-ink sm:text-6xl">
                {t("commitment.title")}
              </h2>

              <p className="mt-7 max-w-md text-base leading-8 text-ink/60 sm:text-lg">
                {t("commitment.description")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              {commitments.map((commitment, index) => (
                <div
                  key={commitment}
                  className="flex items-start gap-5 border-t border-ink/10 py-7 sm:px-6 sm:py-8"
                >
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum text-snow">
                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>

                  <div>
                    <span className="text-xs tracking-[0.16em] text-coral">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-2 font-serif text-2xl text-ink">
                      {commitment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-snow">
        <div className="mx-auto max-w-360 px-6 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          <div className="max-w-5xl">
            <p className="eyebrow text-coral">{t("closing.eyebrow")}</p>

            <h2 className="mt-6 font-serif text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl lg:text-8xl">
              {t("closing.title")}
            </h2>

            <p className="mt-8 max-w-2xl text-base leading-8 text-snow/65 sm:text-lg">
              {t("closing.description")}
            </p>

            <Link href={`/${locale}/shop`} className="button-editorial button-editorial-light group gap-4 mt-4">
              {t("closing.cta")}
              <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}