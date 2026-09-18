"use client";

import Image from "next/image";
import {Minus, Plus, X} from "lucide-react";
import {Link} from "@/i18n/navigation";
import {useLocale} from "next-intl";

import {useCart} from "@/components/cart/cart-provider";
import type {CartItem as CartItemType} from "@/components/cart/cart-provider";
import {useMemo} from "react";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({item}: CartItemProps) {
  const {updateQuantity, removeFromCart} = useCart();
  const locale = useLocale();
  const isArabic = locale === "ar";

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(isArabic ? "ar" : "en", {
        style: "currency",
        currency: "SDG",
        maximumFractionDigits: 0,
      }),
    [isArabic],
  );

  const translation = item.product.translations.find((entry) => entry.locale === locale) ?? item.product.translations.find((entry) => entry.locale === "en");

  const productName = translation?.name ?? "";
  const brand = translation?.brand ?? "";
  const lineTotal = item.size.price * item.quantity;
  const isOutOfStock = item.size.stockQuantity <= 0;
  const isAtStockLimit = item.quantity >= item.size.stockQuantity;

  const decreaseQuantity = () => {
    updateQuantity(item.product.id, item.size.ml, item.quantity - 1);
  };

  const increaseQuantity = () => {
    updateQuantity(item.product.id, item.size.ml, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(item.product.id, item.size.ml);
  };

  return (
    <article className={`relative flex gap-5 border-b border-ink/10 py-7 sm:gap-7 sm:py-8 ${isOutOfStock ? "opacity-60" : ""}`}>
      <Link href={`/shop/${item.product.slug}`} className="relative block h-32 w-24 shrink-0 overflow-hidden bg-white sm:h-40 sm:w-32">
        {item.product.images[0] ? (
          <Image src={item.product.images[0].imageUrl} alt={productName} fill className="object-cover transition-transform duration-700 hover:scale-[1.025]" sizes="(max-width: 640px) 96px, 128px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-snow" aria-hidden="true">
            <span className={`${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.2em] text-ink/25`}>{isArabic ? "لا توجد صورة" : "No image"}</span>
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className={`${isArabic ? "text-sm" : "text-xs"} eyebrow  font-semibold uppercase tracking-[0.3em] text-plum`}>{brand}</p>

          <Link href={`/shop/${item.product.slug}`} className="group/name block">
            <h2 className={`mt-2 font-editorial ${isArabic ? "text-lg sm:text-xl" : "text-base sm:text-lg"} leading-[0.95] tracking-[-0.02em] text-ink transition-colors group-hover/name:text-plum`}>{productName}</h2>
          </Link>

          <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink/35">{item.size.ml}ml</p>
        </div>

        {isOutOfStock && <p className={`mt-3 ${isArabic ? "text-sm" : "text-xs"}  font-semibold uppercase tracking-[0.2em] text-coral`}>{isArabic ? "غير متوفر حاليًا" : "Currently unavailable"}</p>}

        {!isOutOfStock && isAtStockLimit && <p className={`mt-3 ${isArabic ? "text-sm" : "text-xs"}  font-semibold uppercase tracking-[0.2em] text-ink/30`}>{isArabic ? "الحد الأقصى المتاح" : "Maximum available quantity"}</p>}

        <div className="mt-5 flex flex-wrap items-center gap-5">
          <div className="flex h-9 items-center border border-ink/15">
            <button type="button" onClick={decreaseQuantity} aria-label={isArabic ? "تقليل الكمية" : "Decrease quantity"} className="flex h-full w-9 items-center justify-center text-ink/40 transition-colors hover:text-plum">
              <Minus size={12} strokeWidth={1.25} />
            </button>

            <span className="w-7 text-center text-[12px] font-medium">{item.quantity}</span>

            <button type="button" onClick={increaseQuantity} disabled={isOutOfStock || isAtStockLimit} aria-label={isArabic ? "زيادة الكمية" : "Increase quantity"} className="flex h-full w-9 items-center justify-center text-ink/40 transition-colors hover:text-plum disabled:cursor-not-allowed disabled:opacity-25">
              <Plus size={12} strokeWidth={1.25} />
            </button>
          </div>

          <button type="button" onClick={handleRemove} className={`${isArabic ? "text-sm" : "text-xs"}  font-semibold uppercase tracking-[0.25em] text-ink/30 transition-colors hover:text-coral`}>
            {isArabic ? "إزالة" : "Remove"}
          </button>
        </div>
      </div>

      <div className={`shrink-0 text-end ${isArabic ? "text-left" : ""}`}>
        <p className="font-editorial text-lg leading-none text-ink sm:text-xl">
          {currencyFormatter.format(lineTotal)}
        </p>
      </div>

      <button type="button" onClick={handleRemove} aria-label={isArabic ? "إزالة المنتج" : "Remove product"} className="absolute inset-e-0 top-7 text-ink/25 transition-colors hover:text-coral sm:hidden">
        <X size={15} strokeWidth={1.25} />
      </button>
    </article>
  );
}