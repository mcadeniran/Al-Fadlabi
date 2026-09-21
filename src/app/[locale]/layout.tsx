import type {Metadata} from "next";
import {
  Cormorant_Garamond,
  Manrope,
  Noto_Naskh_Arabic,
  Noto_Sans_Arabic,
} from "next/font/google";
import "./globals.css";

import {
  hasLocale,
  NextIntlClientProvider,
} from "next-intl";

import {routing} from "@/i18n/routing";
import {notFound} from "next/navigation";
import {CartProvider} from "@/components/cart/cart-provider";
import {TooltipProvider} from "@/components/ui/tooltip";
import {DirectionProvider} from "@/components/ui/direction";
import {getLocale} from "next-intl/server";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic-sans",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const isArabic = locale === "ar";

  return {
    title: {
      default: isArabic
        ? "الفاضلابي للعطور ومستحضرات التجميل"
        : "Al-Fadlabi Perfumes & Cosmetics",

      template: isArabic
        ? "%s | الفاضلابي للعطور ومستحضرات التجميل"
        : "%s | Al-Fadlabi Perfumes & Cosmetics",
    },

    description: isArabic
      ? "اكتشف مجموعتنا المختارة من العطور ومستحضرات التجميل والعناية الشخصية."
      : "Discover our curated collection of perfumes, cosmetics, and personal care products.",

    applicationName: isArabic
      ? "الفاضلابي للعطور ومستحضرات التجميل"
      : "Al-Fadlabi Perfumes & Cosmetics",

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      siteName: isArabic
        ? "الفاضلابي للعطور ومستحضرات التجميل"
        : "Al-Fadlabi Perfumes & Cosmetics",

      locale: isArabic ? "ar" : "en",

      title: isArabic
        ? "الفاضلابي للعطور ومستحضرات التجميل"
        : "Al-Fadlabi Perfumes & Cosmetics",

      description: isArabic
        ? "اكتشف مجموعتنا المختارة من العطور ومستحضرات التجميل والعناية الشخصية."
        : "Discover our curated collection of perfumes, cosmetics, and personal care products.",
    },

    twitter: {
      card: "summary_large_image",

      title: isArabic
        ? "الفاضلابي للعطور ومستحضرات التجميل"
        : "Al-Fadlabi Perfumes & Cosmetics",

      description: isArabic
        ? "اكتشف مجموعتنا المختارة من العطور ومستحضرات التجميل والعناية الشخصية."
        : "Discover our curated collection of perfumes, cosmetics, and personal care products.",
    },
  };
}


export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string;}>;
}>) {
  const {locale} = await params;
  const direction = locale === "ar" ? "rtl" : "ltr";

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={direction} data-scroll-behavior="smooth">
      <body
        className={`${cormorant.variable} ${manrope.variable} ${notoNaskh.variable} ${notoSansArabic.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <CartProvider>
          <NextIntlClientProvider>
            <DirectionProvider direction={direction}>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </DirectionProvider>
          </NextIntlClientProvider>
        </CartProvider>
      </body>

    </html>
  );
}