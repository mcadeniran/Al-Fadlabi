"use client";

import {ImagePlus, Star, Trash2} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import type {ProductImage} from "@/types/product";

export type ProductImageItem = {
  id: string;
  file?: File;
  preview: string;
  isPrimary: boolean;
  existing: boolean;
  imageUrl?: string;
};

// type ExistingImage = {
//   id: string;
//   image_url: string;
//   sort_order: number;
// };

type ProductImageUploadProps = {
  existingImages?: ProductImage[];
  onImagesChange?: (images: ProductImageItem[]) => void;
};

export function ProductImageUpload({
  existingImages = [],
  onImagesChange,
}: ProductImageUploadProps) {
  const t = useTranslations("AdminProducts");
  const inputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ProductImageItem[]>(() =>
    existingImages.map((image, index) => ({
      id: image.id,
      preview: image.imageUrl,
      isPrimary: index === 0,
      existing: true,
      imageUrl: image.imageUrl,
    })),
  );

  useEffect(() => {
    onImagesChange?.(images);
  }, [images, onImagesChange]);

  function handleFiles(files: FileList | null) {
    if (!files) return;

    const newImages = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        isPrimary: false,
        existing: false,
      }));

    setImages((current) => {
      const combined = [...current, ...newImages];

      if (
        combined.length > 0 &&
        !combined.some((image) => image.isPrimary)
      ) {
        combined[0].isPrimary = true;
      }

      return combined;
    });
  }

  function removeImage(id: string) {
    setImages((current) => {
      const image = current.find((item) => item.id === id);

      if (image && !image.existing) {
        URL.revokeObjectURL(image.preview);
      }

      const remaining = current.filter((item) => item.id !== id);

      if (
        remaining.length > 0 &&
        !remaining.some((item) => item.isPrimary)
      ) {
        remaining[0].isPrimary = true;
      }

      return remaining;
    });
  }

  function setPrimary(id: string) {
    setImages((current) =>
      current.map((image) => ({
        ...image,
        isPrimary: image.id === id,
      })),
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-neutral-950">
          {t("productImages")}
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          {t("productImagesDescription")}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-5 flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center transition hover:border-neutral-400 hover:bg-neutral-100"
      >
        <ImagePlus className="size-8 text-neutral-500" />

        <span className="mt-3 text-sm font-medium text-neutral-900">
          {t("uploadImages")}
        </span>

        <span className="mt-1 text-xs text-neutral-500">
          {t("uploadImagesHint")}
        </span>
      </button>

      {images.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
            >
              <img
                src={image.preview}
                alt=""
                className="aspect-square w-full object-cover"
              />

              {image.isPrimary && (
                <div className="absolute inset-s-2 top-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-medium text-neutral-900 shadow-sm">
                  <Star className="size-3 fill-current" />
                  {t("primaryImage")}
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 p-2 opacity-0 transition group-hover:opacity-100">
                {!image.isPrimary ? (
                  <button
                    type="button"
                    onClick={() => setPrimary(image.id)}
                    className="text-xs font-medium text-white hover:underline"
                  >
                    {t("setPrimary")}
                  </button>
                ) : (
                  <span className="text-xs font-medium text-white">
                    {t("primaryImage")}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="rounded-md p-1.5 text-white transition hover:bg-white/20"
                  aria-label={t("removeImage")}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}