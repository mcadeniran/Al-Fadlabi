"use client";

import {useTransition} from "react";
import {Power} from "lucide-react";
import {useTranslations} from "next-intl";

import {toggleProductActive} from "@/app/[locale]/admin/(protected)/products/actions";

type ProductStatusToggleProps = {
  productId: string;
  isActive: boolean;
};

export function ProductStatusToggle({
  productId,
  isActive,
}: ProductStatusToggleProps) {
  const t = useTranslations("AdminProducts");
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(() => {
      toggleProductActive(productId, !isActive);
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Power className="size-3.5" />

      {isPending
        ? t("updating")
        : isActive
          ? t("deactivate")
          : t("activate")}
    </button>
  );
}