"use client";

import {Check, Pencil} from "lucide-react";
import {useState, useTransition} from "react";
import {useTranslations} from "next-intl";

import {updateInventoryStock} from "@/app/[locale]/admin/(protected)/inventory/actions";

type InventoryStockEditorProps = {
  productSizeId: string;
  stockQuantity: number;
};

export function InventoryStockEditor({
  productSizeId,
  stockQuantity,
}: InventoryStockEditorProps) {
  const t = useTranslations("AdminInventory");

  const [value, setValue] = useState(
    String(stockQuantity),
  );

  const [editing, setEditing] =
    useState(false);

  const [isPending, startTransition] =
    useTransition();

  function save() {
    const quantity = Number(value);

    if (
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return;
    }

    startTransition(async () => {
      await updateInventoryStock(
        productSizeId,
        quantity,
      );

      setEditing(false);
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="group inline-flex items-center gap-2 font-medium text-neutral-900"
      >
        {stockQuantity}

        <Pencil className="size-3.5 text-neutral-400 opacity-0 transition group-hover:opacity-100" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(event) =>
          setValue(event.target.value)
        }
        className="h-9 w-24 rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-500"
        autoFocus
        disabled={isPending}
      />

      <button
        type="button"
        onClick={save}
        disabled={isPending}
        aria-label={t("saveStock")}
        className="inline-flex size-9 items-center justify-center rounded-lg bg-neutral-950 text-white transition hover:bg-neutral-800 disabled:opacity-50"
      >
        <Check className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => {
          setValue(String(stockQuantity));
          setEditing(false);
        }}
        disabled={isPending}
        className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
      >
        {t("cancel")}
      </button>
    </div>
  );
}