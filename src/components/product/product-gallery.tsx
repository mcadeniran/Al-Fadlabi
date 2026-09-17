"use client";

import Image from "next/image";
import {useState} from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {useLocale} from "next-intl";
import type {Product} from "@/types/product";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({
  product,
}: ProductGalleryProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const translation =
    product.translations.find(
      (item) => item.locale === locale
    ) ??
    product.translations.find(
      (item) => item.locale === "en"
    );

  const name = translation?.name ?? "";

  const uniqueImages = Array.from(
    new Set(
      product.images.map(
        (image) => image.imageUrl
      )
    )
  );

  const [activeIndex, setActiveIndex] =
    useState(0);

  if (uniqueImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] bg-white">
        <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-ink/25">
          {isArabic ? "لا توجد صورة" : "No Image"}
        </span>
      </div>
    );
  }

  const activeImage = uniqueImages[activeIndex];

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0
        ? uniqueImages.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === uniqueImages.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <div className="min-w-0">
      {/* =====================================================
          MAIN IMAGE
          ===================================================== */}

      <div className="group relative aspect-square overflow-hidden rounded-[1.5rem] bg-white">
        <Image
          src={activeImage}
          alt={name}
          fill
          priority
          className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 48vw"
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/20 via-transparent to-transparent opacity-60" />

        {/* IMAGE COUNTER */}

        {uniqueImages.length > 1 && (
          <div className={`absolute bottom-4 rounded-full bg-ink/65 px-3 py-1.5 text-[8px] font-medium tracking-[0.16em] text-white backdrop-blur-sm ${isArabic ? "inset-e-4" : "inset-s-4"}`}>
            {String(activeIndex + 1).padStart(2, "0")}
            {" / "}
            {String(uniqueImages.length).padStart(2, "0")}
          </div>
        )}

        {/* PREVIOUS */}

        {uniqueImages.length > 1 && (
          <button
            type="button"
            onClick={previousImage}
            aria-label={
              isArabic
                ? "الصورة السابقة"
                : "Previous image"
            }
            className={`absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-ink/25 text-white backdrop-blur-sm transition-all duration-300 hover:bg-ink/60 lg:opacity-0 lg:group-hover:opacity-100 ${isArabic ? "inset-e-4" : "inset-s-4"}`}
          >
            {isArabic ? (
              <ChevronRight
                size={16}
                strokeWidth={1.25}
              />
            ) : (
              <ChevronLeft
                size={16}
                strokeWidth={1.25}
              />
            )}
          </button>
        )}

        {/* NEXT */}

        {uniqueImages.length > 1 && (
          <button
            type="button"
            onClick={nextImage}
            aria-label={
              isArabic
                ? "الصورة التالية"
                : "Next image"
            }
            className={`absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-ink/25 text-white backdrop-blur-sm transition-all duration-300 hover:bg-ink/60 lg:opacity-0 lg:group-hover:opacity-100 ${isArabic ? "inset-s-4" : "inset-e-4"}`}
          >
            {isArabic ? (
              <ChevronLeft
                size={16}
                strokeWidth={1.25}
              />
            ) : (
              <ChevronRight
                size={16}
                strokeWidth={1.25}
              />
            )}
          </button>
        )}
      </div>

      {/* =====================================================
          THUMBNAILS
          ===================================================== */}

      {uniqueImages.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3" role="list"
          aria-label={
            isArabic
              ? "صور المنتج"
              : "Product images"
          }
        >
          {uniqueImages.map(
            (image, index) => {
              const isActive =
                index === activeIndex;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  aria-label={
                    isArabic
                      ? `عرض الصورة ${index + 1}`
                      : `View image ${index + 1}`
                  }
                  aria-current={
                    isActive
                      ? "true"
                      : undefined
                  }
                  className={`group/thumb relative aspect-square overflow-hidden rounded-xl bg-white transition-all duration-300 ${isActive ? "ring-1 ring-plum ring-offset-2 ring-offset-snow" : "opacity-50 hover:opacity-100"}`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}