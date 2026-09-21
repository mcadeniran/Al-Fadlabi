type BreadcrumbJsonLdProps = {
  locale: "en" | "ar";
  productName: string;
  productSlug: string;
};

export function BreadcrumbJsonLd({
  locale,
  productName,
  productSlug,
}: BreadcrumbJsonLdProps) {
  const isArabic = locale === "ar";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const homeUrl = isArabic ? "/" : "/en";
  const shopUrl = isArabic ? "/shop" : "/en/shop";
  const productUrl = `${shopUrl}/${productSlug}`;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isArabic ? "الرئيسية" : "Home",
        item: `${siteUrl}${homeUrl}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isArabic ? "المتجر" : "Shop",
        item: `${siteUrl}${shopUrl}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productName,
        item: `${siteUrl}${productUrl}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbs).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}
