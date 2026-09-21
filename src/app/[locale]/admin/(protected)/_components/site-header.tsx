'use client';

import {Separator} from "@/components/ui/separator";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {usePathname, useRouter} from "@/i18n/navigation";
import {useLocale, useTranslations} from "next-intl";

export function SiteHeader() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Admin");
  const c = useTranslations("Navigation");

  const pageTitles: Record<string, string> = {
    "/admin": t("dashboard"),
    "/admin/products": t("products"),
    "/admin/orders": t("orders"),
    "/admin/users": t("users"),
    "/admin/inventory": t("inventory"),
    "/admin/account": t("account"),
  };

  const currentTitle =
    pageTitles[pathname] ??
    Object.entries(pageTitles)
      .filter(([path]) => path !== "/admin" && pathname.startsWith(`${path}/`))
      .sort(([a], [b]) => b.length - a.length)[0]?.[1] ??
    t("dashboard");

  const nextLocale = locale === "en" ? "ar" : "en";

  const handleLocaleChange = () => {
    router.replace(pathname, {
      locale: nextLocale,
    });
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 mt-2"
        />
        <h1 className="truncate text-base font-semibold tracking-tight">
          {currentTitle}
        </h1>
        <div className={`${locale === 'ar' ? "mr-auto" : "ml-auto"}  flex items-center gap-2`}>
          <button
            type="button"
            onClick={handleLocaleChange}
            aria-label={c("language")}
            className={`hidden border-s ps-5 ${locale === 'en' ? "text-lg" : "text-sm"} font-medium uppercase tracking-[0.2em] transition-colors hover:text-plum sm:block "border-ink/10"`}>
            {nextLocale === "ar"
              ? "العربية"
              : "English"}
          </button>
        </div>
      </div>
    </header>
  );
}
