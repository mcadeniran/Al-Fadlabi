type OrganizationJsonLdProps = {
  locale: "en" | "ar";
};

export function OrganizationJsonLd({
  locale,
}: OrganizationJsonLdProps) {
  const isArabic = locale === "ar";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const organization = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",

    name: isArabic
      ? "الفاضلابي للعطور ومستحضرات التجميل"
      : "Al-Fadlabi Perfumes & Cosmetics",

    alternateName: isArabic
      ? "Al-Fadlabi Perfumes & Cosmetics"
      : "الفاضلابي للعطور ومستحضرات التجميل",

    url: siteUrl,

    logo: `${siteUrl}/images/brand/al-fadlabi-logo.jpeg`,

    description: isArabic
      ? "اكتشف مجموعتنا المختارة من العطور ومستحضرات التجميل والعناية الشخصية."
      : "Discover our curated collection of perfumes, cosmetics, and personal care products.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organization).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}