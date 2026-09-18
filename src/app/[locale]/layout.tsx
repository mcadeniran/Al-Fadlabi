import type {Metadata} from "next";
import {Cormorant_Garamond, Manrope, Noto_Naskh_Arabic, Noto_Sans_Arabic, } from "next/font/google";
import "./globals.css";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {routing} from "@/i18n/routing";
import {notFound} from "next/navigation";
import {CartProvider} from "@/components/cart/cart-provider";
import {TooltipProvider} from "@/components/ui/tooltip";

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

export const metadata: Metadata = {
  title: "Perfume Store",
  description: "Discover your signature fragrance.",
};

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
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </NextIntlClientProvider>
        </CartProvider>
      </body>

    </html>
  );
}