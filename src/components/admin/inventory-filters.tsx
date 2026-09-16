"use client";

import {Search, X} from "lucide-react";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {
  usePathname,
  useRouter,
} from "@/i18n/navigation";
import {useSearchParams} from "next/navigation";

export function InventoryFilters() {
  const t = useTranslations("AdminInventory");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? "",
  );

  const status =
    searchParams.get("status") ?? "all";

  const gender =
    searchParams.get("gender") ?? "all";

  const productStatus =
    searchParams.get("productStatus") ?? "all";

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateFilter("search", search);
    }, 350);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function updateFilter(
    key: string,
    value: string,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();

    router.replace(
      query
        ? `${pathname}?${query}`
        : pathname,
    );
  }

  function clearFilters() {
    setSearch("");
    router.replace(pathname);
  }

  const hasFilters =
    search ||
    status !== "all" ||
    gender !== "all" ||
    productStatus !== "all";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={t("searchPlaceholder")}
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white ps-10 pe-4 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            updateFilter(
              "status",
              event.target.value,
            )
          }
          className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
        >
          <option value="all">
            {t("allStockStatuses")}
          </option>

          <option value="in_stock">
            {t("in_stock")}
          </option>

          <option value="low_stock">
            {t("low_stock")}
          </option>

          <option value="out_of_stock">
            {t("out_of_stock")}
          </option>
        </select>

        <select
          value={gender}
          onChange={(event) =>
            updateFilter(
              "gender",
              event.target.value,
            )
          }
          className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
        >
          <option value="all">
            {t("allGenders")}
          </option>

          <option value="women">
            {t("women")}
          </option>

          <option value="men">
            {t("men")}
          </option>

          <option value="unisex">
            {t("unisex")}
          </option>
        </select>

        <select
          value={productStatus}
          onChange={(event) =>
            updateFilter(
              "productStatus",
              event.target.value,
            )
          }
          className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
        >
          <option value="all">
            {t("allProductStatuses")}
          </option>

          <option value="active">
            {t("active")}
          </option>

          <option value="inactive">
            {t("inactive")}
          </option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <X className="size-4" />
            {t("clearFilters")}
          </button>
        )}
      </div>
    </div>
  );
}