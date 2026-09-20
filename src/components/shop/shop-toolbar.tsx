"use client";

import {usePathname, useRouter} from "@/i18n/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useLocale, useTranslations} from "next-intl";

type GenderFilter = "all" | "women" | "men" | "unisex";

type SortOption = "featured" | "newest" | "price-low" | "price-high";

type ShopToolbarProps = {
  gender?: GenderFilter;
  sort: SortOption;
  productCount: number;
};

export function ShopToolbar({gender = "all", sort, productCount}: ShopToolbarProps) {
  const t = useTranslations("Shop");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();


  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(window.location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, {scroll: false});
  };

  const handleGenderChange = (value: GenderFilter) => {
    updateParams({
      gender: value === "all" ? null : value,
    });
  };

  const handleSortChange = (value: SortOption) => {
    updateParams({
      sort: value === "featured" ? null : value,
    });
  };

  return (
    <div className="mb-14 border-y border-ink/10 py-5 md:mb-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Gender */}
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <span className={`me-2 font-light uppercase tracking-[0.25em] text-ink/70 ${locale === 'ar' ? 'text-xl' : "text-sm"}`}>{t("filter")}</span>

          <GenderButton active={gender === "all"} label={t("all")} onClick={() => handleGenderChange("all")} locale={locale} />

          <GenderButton active={gender === "women"} label={t("women")} onClick={() => handleGenderChange("women")} locale={locale} />

          <GenderButton active={gender === "men"} label={t("men")} onClick={() => handleGenderChange("men")} locale={locale} />

          <GenderButton active={gender === "unisex"} label={t("unisex")} onClick={() => handleGenderChange("unisex")} locale={locale} />
        </div>

        {/* Count + sort */}
        <div className="flex items-center justify-between gap-6 md:justify-end">
          <p className={`font-medium uppercase tracking-[0.24em] text-ink/30 ${locale === 'ar' ? "text-lg" : "text-sm"}`}>
            {productCount} {t("products")}
          </p>

          <div className="flex items-center gap-3">
            <span className={`${locale === 'ar' ? "text-lg" : "text-sm"} font-semibold uppercase tracking-[0.2em] text-ink/30`}>{t("sortBy")}</span>

            <Select value={sort} onValueChange={(value) => handleSortChange(value as SortOption)}>
              <SelectTrigger className={`h-8 w-36 rounded-none border-0 border-b border-ink/20 bg-transparent px-0 ${locale === 'ar' ? "text-base" : "text-sm"}  uppercase tracking-[0.14em] text-ink shadow-none focus:ring-0`}>
                <SelectValue>{sort === 'featured' ? t("sortFeatured") : sort === 'newest' ? t("sortNewest") : sort === 'price-high' ? t("sortPriceHigh") : t("sortPriceLow")}</SelectValue>
              </SelectTrigger>

              <SelectContent align="end" className="rounded-none border-ink/10 bg-white">
                <SelectItem value="featured" className={`${locale === 'ar' ? "text-base" : "text-xs"} uppercase tracking-[0.14em]`}>
                  {t("sortFeatured")}
                </SelectItem>

                <SelectItem value="newest" className={`${locale === 'ar' ? "text-base" : "text-xs"} uppercase tracking-[0.14em]`}>
                  {t("sortNewest")}
                </SelectItem>

                <SelectItem value="price-low" className={`${locale === 'ar' ? "text-base" : "text-xs"} uppercase tracking-[0.14em]`}>
                  {t("sortPriceLow")}
                </SelectItem>

                <SelectItem value="price-high" className={`${locale === 'ar' ? "text-base" : "text-xs"} uppercase tracking-[0.14em]`}>
                  {t("sortPriceHigh")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

type GenderButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
  locale: string;
};

function GenderButton({active, label, onClick, locale}: GenderButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`relative py-2 ${locale === 'ar' ? "text-xl" : "text-sm"} uppercase tracking-[0.24em] transition-colors ${active ? "text-plum" : "text-ink/70 hover:text-plum"}`}>
      {label}

      {active && <span className="absolute inset-x-0 -bottom-1 mx-auto h-px w-full bg-plum" />}
    </button>
  );
}