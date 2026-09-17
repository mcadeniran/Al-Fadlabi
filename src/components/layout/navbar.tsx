"use client";

import {useState} from "react";
import {
  Menu,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";

import {
  Link,
  usePathname,
  useRouter,
} from "@/i18n/navigation";

import {useCart} from "@/components/cart/cart-provider";

export function Navbar() {
  const t = useTranslations("Navigation");

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const {itemCount, isHydrated} = useCart();

  const [isOpen, setIsOpen] = useState(false);

  const nextLocale = locale === "en" ? "ar" : "en";

  const displayItemCount = isHydrated ? itemCount : 0;

  const isHomePage = pathname === "/";

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLocaleChange = () => {
    router.replace(pathname, {
      locale: nextLocale,
    });

    setIsOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  /*
   * Homepage:
   * Transparent header over the hero.
   *
   * Internal pages:
   * Soft white translucent header.
   */
  const navText = isHomePage
    ? "text-white"
    : "text-ink";

  const navMutedText = isHomePage
    ? "text-white/75"
    : "text-ink/65";

  const navHoverText = isHomePage
    ? "hover:text-white"
    : "hover:text-ink";

  const navBorder = isHomePage
    ? "border-transparent"
    : "border-ink/8";

  const navBackground = isHomePage
    ? "bg-transparent"
    : "bg-snow/92 backdrop-blur-xl";

  return (
    <>
      {/* =========================================================
          DESKTOP / MAIN NAVBAR
          ========================================================= */}

      <header
        className={`absolute inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${navBorder} ${navBackground}`}>
        <div className="mx-auto flex h-20 w-full max-w-360 items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16">
          {/* =====================================================
              MOBILE MENU BUTTON
              ===================================================== */}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={t("openMenu")}
            className={`flex items-center justify-center transition-opacity hover:opacity-60 lg:hidden ${navText}`}>
            <Menu
              size={25}
              strokeWidth={1.25}
            />
          </button>

          {/* =====================================================
              LOGO
              ===================================================== */}
          <Link
            href="/"
            aria-label={t("home")}
            className="group relative block shrink-0"
            onClick={closeMenu}
          >
            <Image
              src="/images/brand/al-fadlabi-logo.png"
              alt="Al-Fadlabi Perfumes & Cosmetics"
              width={60}
              height={60}
              priority
              className="h-auto w-10 object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:w-10 lg:w-15"
            />
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
              ===================================================== */}

          <nav
            aria-label={t("home")}
            className={`hidden items-center gap-10 lg:flex xl:gap-12 ${locale === 'ar' ? "text-xl" : "text-xs"}`}>
            {/* SHOP */}

            <Link
              href="/"
              className={`group relative py-1 font-medium uppercase tracking-[0.18em] transition-colors ${isActive("/") ? navText : `${navMutedText} ${navHoverText}`}`}>
              {t("home")}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-plum transition-all duration-300 ${isActive("/") ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>

            <Link
              href="/shop"
              className={`group relative py-1 font-medium uppercase tracking-[0.18em] transition-colors ${isActive("/shop") ? navText : `${navMutedText} ${navHoverText}`}`}>
              {t("shop")}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-plum transition-all duration-300 ${isActive("/shop") ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>

            {/* OUR STORY */}

            <Link
              href="/our-story"
              className={`group relative py-1  font-medium uppercase tracking-[0.18em] transition-colors ${isActive("/our-story") ? navText : `${navMutedText} ${navHoverText}`}`}>
              {t("story")}

              <span
                className={`absolute -bottom-1 left-0 h-px bg-plum transition-all duration-300 ${isActive("/our-story") ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>
          </nav>

          {/* =====================================================
              ACTIONS
              ===================================================== */}

          <div className="flex items-center gap-6">
            {/* ACCOUNT */}

            <Link
              href="/account"
              aria-label={t("account")}
              className={`hidden transition-colors hover:text-plum sm:block ${navMutedText}`}>
              <UserRound
                size={21}
                strokeWidth={1.25}
              />
            </Link>

            {/* CART */}

            <Link
              href="/cart"
              aria-label={t("cart")}
              className={`relative transition-colors hover:text-plum ${navMutedText}`}>
              <ShoppingBag
                size={22}
                strokeWidth={1.25}
              />

              <span className={`absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-plum px-1 text-[8px] font-semibold text-white transition-all duration-300 ${displayItemCount > 0 ? "scale-100 opacity-100" : "scale-90 opacity-70"}`}>
                {displayItemCount}
              </span>
            </Link>

            {/* LANGUAGE */}

            <button
              type="button"
              onClick={handleLocaleChange}
              aria-label={t("language")}
              className={`hidden border-s ps-5 ${locale === 'en' ? "text-lg" : "text-sm"} font-medium uppercase tracking-[0.2em] transition-colors hover:text-plum sm:block ${isHomePage ? "border-white/20" : "border-ink/10"} ${navMutedText}`}>
              {nextLocale === "ar"
                ? "العربية"
                : "English"}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE MENU
          ========================================================= */}

      <div
        className={`fixed inset-0 z-60 bg-ink transition-all duration-500 lg:hidden ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`} aria-hidden={!isOpen}>
        <div className="flex min-h-full flex-col px-7 py-8 sm:px-10">
          {/* =====================================================
              MOBILE MENU HEADER
              ===================================================== */}

          <div className="flex items-start justify-between">

            <Link
              href="/"
              onClick={closeMenu}
              className="group block"
            >
              <Image
                src="/images/brand/al-fadlabi-logo.png"
                alt="Al-Fadlabi Perfumes & Cosmetics"
                width={60}
                height={60}
                className="h-auto w-12 object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              aria-label={t("closeMenu")}
              className="text-white transition-opacity hover:opacity-60">
              <X
                size={27}
                strokeWidth={1.25}
              />
            </button>
          </div>

          {/* =====================================================
              MOBILE MENU CONTENT
              ===================================================== */}

          <nav
            aria-label={t("mobileMenu.title")}
            className="flex flex-1 flex-col justify-center">
            <div className="space-y-6">
              {/* SHOP */}

              <Link
                href="/shop"
                onClick={closeMenu}
                className={`block font-heading text-[3rem] leading-none tracking-tight transition-colors sm:text-[3.5rem] ${isActive("/shop") ? "text-coral" : "text-white hover:text-coral"}`}>
                {t("shop")}
              </Link>

              {/* COLLECTIONS */}

              <Link
                href="/collections"
                onClick={closeMenu}
                className={`block font-heading text-[3rem] leading-none tracking-tight transition-colors sm:text-[3.5rem] ${isActive("/collections") ? "text-coral" : "text-white hover:text-coral"}`}>
                {t("collections")}
              </Link>

              {/* OUR STORY */}

              <Link
                href="/our-story"
                onClick={closeMenu}
                className={`block font-heading text-[3rem] leading-none tracking-tight transition-colors sm:text-[3.5rem] ${isActive("/our-story") ? "text-coral" : "text-white hover:text-coral"}`}>
                {t("story")}
              </Link>
            </div>

            {/* DIVIDER */}

            <div className="mt-14 h-px w-full bg-white/10" />

            {/* SECONDARY LINKS */}

            <div className="mt-8 space-y-6">
              {/* ACCOUNT */}

              <Link
                href="/account"
                onClick={closeMenu}
                className="flex items-center gap-3  font-medium uppercase tracking-[0.22em] text-white/65 transition-colors hover:text-white">
                <UserRound
                  size={17}
                  strokeWidth={1.25}
                />
                {t("account")}
              </Link>

              {/* CART */}

              <Link
                href="/cart"
                onClick={closeMenu}
                className="flex items-center gap-3  font-medium uppercase tracking-[0.22em] text-white/65 transition-colors hover:text-white">
                <ShoppingBag
                  size={17}
                  strokeWidth={1.25}
                />

                {t("cart")}

                {displayItemCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-[8px] font-semibold text-white">
                    {displayItemCount}
                  </span>
                )}
              </Link>

              {/* LANGUAGE */}

              <button
                type="button"
                onClick={handleLocaleChange}
                className="pt-2  font-medium uppercase tracking-[0.22em] text-coral transition-opacity hover:opacity-70">
                {nextLocale === "ar"
                  ? "العربية"
                  : "English"}
              </button>
            </div>
          </nav>

          {/* =====================================================
              MOBILE MENU FOOTER
              ===================================================== */}

          <div className="text-[8px] font-medium uppercase tracking-[0.4em] text-white/25">
            Fragrance House
          </div>
        </div>
      </div>
    </>
  );
}
