"use client";

import {useTransition} from "react";
import {useTranslations} from "next-intl";

import {updateProductFlags} from "@/app/[locale]/admin/(protected)/products/actions";

type ProductFlag =
  | "featured"
  | "new_arrival"
  | "bestseller";

type ProductFlagToggleProps = {
  productId: string;
  flag: ProductFlag;
  active: boolean;
};

export function ProductFlagToggle({
  productId,
  flag,
  active,
}: ProductFlagToggleProps) {
  const t = useTranslations("AdminProducts");
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(() => {
      updateProductFlags(productId, {
        [flag]: !active,
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={active}
      className={[
        "rounded-full border px-2 py-1 text-[11px] font-medium transition",
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900",
        isPending
          ? "cursor-not-allowed opacity-50"
          : "",
      ].join(" ")}
    >
      {t(flag === "new_arrival" ? "newArrival" : flag)}
    </button>
  );
}