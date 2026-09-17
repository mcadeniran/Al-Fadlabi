"use client";

import {useMemo, useState} from "react";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {useLocale} from "next-intl";
import type {Product} from "@/types/product";
import {useCart} from "@/components/cart/cart-provider";

type ProductPurchaseProps = {
  product: Product;
};

export function ProductPurchase({
  product,
}: ProductPurchaseProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const {addToCart} = useCart();

  const [addedToCart, setAddedToCart] =
    useState(false);

  const firstAvailableSizeIndex =
    product.sizes.findIndex(
      (size) => size.stockQuantity > 0
    );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(isArabic ? "ar" : "en", {
        style: "currency",
        currency: "SDG",
        maximumFractionDigits: 0,
      }),
    [isArabic],
  );

  const [
    selectedSizeIndex,
    setSelectedSizeIndex,
  ] = useState(
    firstAvailableSizeIndex >= 0
      ? firstAvailableSizeIndex
      : 0
  );

  const [quantity, setQuantity] =
    useState(1);

  const selectedSize =
    product.sizes[selectedSizeIndex];

  if (!selectedSize) {
    return null;
  }

  const hasAvailableSize =
    product.sizes.some(
      (size) => size.stockQuantity > 0
    );

  const isInStock =
    selectedSize.stockQuantity > 0;

  const totalPrice =
    selectedSize.price * quantity;

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(
        selectedSize.stockQuantity,
        current + 1
      )
    );
  };

  const handleAddToCart = () => {
    if (!isInStock) {
      return;
    }

    addToCart({
      product,
      size: selectedSize,
      quantity,
    });

    setAddedToCart(true);

    window.setTimeout(() => {
      setAddedToCart(false);
    }, 2500);
  };

  return (
    <div className="mt-7">
      {/* =====================================================
          PRICE
          ===================================================== */}

      <div
        className={`flex items-baseline gap-3 ${isArabic ? "justify-end" : ""}`}>
        <span className={`font-editorial ${isArabic ? "text-2xl" : "text-2xl"} leading-none text-ink`}>
          {currencyFormatter.format(totalPrice)}
        </span>

        {selectedSize.compareAtPrice &&
          selectedSize.price !==
          selectedSize.compareAtPrice && (
            <span className="text-base text-ink/30 line-through">
              {currencyFormatter.format(selectedSize.compareAtPrice *
                quantity)}
            </span>
          )}
      </div>

      {/* =====================================================
          SIZE
          ===================================================== */}

      <div className="mt-7">
        <div className={`mb-3 flex items-center justify-between gap-5 ${isArabic ? "flex-row-reverse" : ""}`}>
          <span className={`${isArabic ? "text-xl" : "text-sm"} font-semibold uppercase tracking-[0.25em] text-ink/45`}>
            {isArabic ? "الحجم" : "Size"}
          </span>

          <span className="text-xs text-ink/45">
            {selectedSize.ml}ml
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map(
            (size, index) => {
              const isSelected =
                index === selectedSizeIndex;

              const isSizeAvailable =
                size.stockQuantity > 0;

              return (
                <button
                  key={`${size.ml}-${index}`}
                  type="button"
                  onClick={() => {
                    setSelectedSizeIndex(
                      index
                    );
                    setQuantity(1);
                  }}
                  disabled={
                    !isSizeAvailable
                  }
                  className={`relative flex h-12 min-w-20 items-center justify-center rounded-full border px-5 text-xs transition-all duration-300 ${isSelected ? "border-ink bg-ink text-snow" : isSizeAvailable ? "border-ink/15 bg-transparent text-ink hover:border-plum hover:text-plum" : "cursor-not-allowed border-ink/8 text-ink/20"}`}>
                  {size.ml}ml

                  {size.compareAtPrice &&
                    size.price <
                    size.compareAtPrice && (
                      <span className="absolute inset-e-2 top-2 h-1.5 w-1.5 rounded-full bg-coral" />
                    )}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* =====================================================
          QUANTITY + ADD
          ===================================================== */}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {/* QUANTITY */}

        <div className="flex h-14 items-center justify-between rounded-full border border-ink/15 px-5 sm:w-32 sm:shrink-0">
          <button
            type="button"
            onClick={decreaseQuantity}
            aria-label={
              isArabic
                ? "تقليل الكمية"
                : "Decrease quantity"
            }
            className="text-lg text-ink/40 transition-colors hover:text-plum">
            −
          </button>

          <span className="text-xs font-medium">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increaseQuantity}
            aria-label={
              isArabic
                ? "زيادة الكمية"
                : "Increase quantity"
            }
            disabled={
              quantity >=
              selectedSize.stockQuantity
            }
            className="text-lg text-ink/40 transition-colors hover:text-plum disabled:cursor-not-allowed disabled:opacity-25">
            +
          </button>
        </div>

        {/* ADD TO CART */}

        <button
          type="button"
          disabled={
            !isInStock ||
            !hasAvailableSize
          }
          onClick={handleAddToCart}
          className={`group flex h-14 flex-1 items-center justify-center gap-4 rounded-full bg-ink py-4 px-7 ${isArabic ? "text-lg" : "text-sm"} font-semibold uppercase tracking-[0.25em] text-snow transition-all duration-300 hover:bg-plum disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/35`}>
          <span>
            {addedToCart
              ? isArabic
                ? "تمت الإضافة إلى الحقيبة"
                : "Added to Bag"
              : isInStock
                ? isArabic
                  ? "أضف إلى الحقيبة"
                  : "Add to Bag"
                : isArabic
                  ? "غير متوفر"
                  : "Out of Stock"}
          </span>

          {isArabic ? (
            <ArrowLeft
              size={16}
              strokeWidth={1.25}
            />
          ) : (
            <ArrowRight
              size={16}
              strokeWidth={1.25}
            />
          )}
        </button>
      </div>

      {/* =====================================================
          AVAILABILITY
          ===================================================== */}

      <div
        className={`mt-4 flex items-center gap-2 ${isArabic ? "justify-end" : ""}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${isInStock ? "bg-plum" : "bg-ink/20"}`} />

        <span className={`${isArabic ? "text-lg" : "text-sm"} font-semibold uppercase tracking-[0.22em] text-ink/40`}>
          {isInStock
            ? isArabic
              ? "متوفر"
              : "In Stock"
            : isArabic
              ? "غير متوفر"
              : "Out of Stock"}
        </span>
      </div>
    </div>
  );
}