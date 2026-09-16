"use client";

import {useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {ProductImageItem, ProductImageUpload} from "./product-image-upload";
import {createProduct, reconcileProductImages, reconcileProductNotes, reconcileProductSizes, saveProductNotes, saveProductSizes, saveProductTranslations, uploadProductImage} from "@/app/[locale]/admin/(protected)/products/actions";
import {useRouter} from "@/i18n/navigation";
import {Product, ProductNote, ProductSize, ProductTranslation} from "@/types/product";

type ProductFormProps = {
  product?: Product;
};

type SizeRow = {
  id: string;
  ml: string;
  price: string;
  compareAtPrice: string;
  stockQuantity: string;
};

type NoteRow = {
  id: string;
  en: string;
  ar: string;
};

export function ProductForm({
  product,
}: ProductFormProps) {
  const t = useTranslations("AdminProducts");

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  function getTranslation(
    translations: ProductTranslation[],
    locale: "en" | "ar",
  ) {
    return translations?.find(
      (translation) => translation.locale === locale,
    );
  }

  const en = getTranslation(
    product?.translations ?? [],
    "en",
  );

  const ar = getTranslation(
    product?.translations ?? [],
    "ar",
  );

  const [sizes, setSizes] = useState<SizeRow[]>(
    product?.sizes?.length
      ? product.sizes.map((size: ProductSize) => ({
        id: size.id,
        ml: String(size.ml ?? ""),
        price: String(size.price ?? ""),
        compareAtPrice: String(
          size.compareAtPrice ?? "",
        ),
        stockQuantity: String(
          size.stockQuantity ?? "",
        ),
      }))
      : [
        {
          id: crypto.randomUUID(),
          ml: "",
          price: "",
          compareAtPrice: "",
          stockQuantity: "",
        },
      ],
  );

  const [saveError, setSaveError] = useState<string | null>(null);

  function getNotes(
    notes: ProductNote[],
    type: "top" | "heart" | "base",
  ): NoteRow[] {
    const filtered = notes.filter(
      (note) => note.type === type,
    );

    if (filtered.length === 0) {
      return [
        {
          id: crypto.randomUUID(),
          en: "",
          ar: "",
        },
      ];
    }

    return filtered.map((note) => ({
      id: note.id,
      en:
        note.translations.find(
          (translation) => translation.locale === "en",
        )?.name ?? "",
      ar:
        note.translations.find(
          (translation) => translation.locale === "ar",
        )?.name ?? "",
    }));
  }

  const [notes, setNotes] = useState({
    top: getNotes(product?.notes ?? [], "top"),
    heart: getNotes(product?.notes ?? [], "heart"),
    base: getNotes(product?.notes ?? [], "base"),
  });

  const [productImages, setProductImages] = useState<ProductImageItem[]>([]);

  const existingImages =
    product?.images
      ?.slice()
      .sort(
        (a, b) => a.sortOrder - b.sortOrder,
      ) ?? [];

  const [form, setForm] = useState({
    nameEn: en?.name ?? "",
    nameAr: ar?.name ?? "",

    brandEn: en?.brand ?? "",
    brandAr: ar?.brand ?? "",

    slug: product?.slug ?? "",

    descriptionEn: en?.description ?? "",
    descriptionAr: ar?.description ?? "",

    gender: product?.gender ?? "unisex",

    isActive: product?.isActive ?? true,
    featured: product?.featured ?? false,
    newArrival: product?.newArrival ?? false,
    bestseller: product?.bestseller ?? false,

    concentration: en?.concentration ?? "",
    detailsSize: en?.detailsSize ?? "",

    longevityEn: en?.longevity ?? "",
    longevityAr: ar?.longevity ?? "",

    badgeEn: en?.badge ?? "",
    badgeAr: ar?.badge ?? "",
  });

  function updateField(
    field: keyof typeof form,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addSize() {
    setSizes((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        ml: "",
        price: "",
        compareAtPrice: "",
        stockQuantity: "",
      },
    ]);
  }

  function removeSize(id: string) {
    setSizes((current) =>
      current.length === 1
        ? current
        : current.filter((size) => size.id !== id),
    );
  }

  function addNote(type: "top" | "heart" | "base") {
    setNotes((current) => ({
      ...current,
      [type]: [
        ...current[type],
        {
          id: crypto.randomUUID(),
          en: "",
          ar: "",
        },
      ],
    }));
  }

  function removeNote(
    type: "top" | "heart" | "base",
    id: string,
  ) {
    setNotes((current) => ({
      ...current,
      [type]:
        current[type].length === 1
          ? current[type]
          : current[type].filter(
            (note) => note.id !== id,
          ),
    }));
  }

  function updateNote(
    type: "top" | "heart" | "base",
    id: string,
    field: "en" | "ar",
    value: string,
  ) {
    setNotes((current) => ({
      ...current,
      [type]: current[type].map((note) =>
        note.id === id
          ? {
            ...note,
            [field]: value,
          }
          : note,
      ),
    }));
  }

  function updateSize(
    id: string,
    field: keyof Omit<SizeRow, "id">,
    value: string,
  ) {
    setSizes((current) =>
      current.map((size) =>
        size.id === id
          ? {
            ...size,
            [field]: value,
          }
          : size,
      ),
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaveError(null);

    startTransition(async () => {
      const parsedSizes = sizes.map((size) => ({
        id: size.id,
        ml: Number(size.ml),
        price: Number(size.price),
        compareAtPrice:
          size.compareAtPrice.trim() === ""
            ? undefined
            : Number(size.compareAtPrice),
        stockQuantity: Number(size.stockQuantity),
      }));

      const seenSizes = new Set<number>();

      for (const size of parsedSizes) {
        if (
          !Number.isInteger(size.ml) ||
          size.ml <= 0
        ) {
          return;
        }

        if (seenSizes.has(size.ml)) {
          return;
        }

        seenSizes.add(size.ml);

        if (
          !Number.isFinite(size.price) ||
          size.price < 0
        ) {
          return;
        }

        if (
          size.compareAtPrice !== undefined &&
          (!Number.isFinite(size.compareAtPrice) ||
            size.compareAtPrice < 0)
        ) {
          return;
        }

        if (
          !Number.isInteger(size.stockQuantity) ||
          size.stockQuantity < 0
        ) {
          return;
        }
      }

      const parsedNotes = {
        top: notes.top
          .map((note) => ({
            id: note.id,
            en: note.en.trim(),
            ar: note.ar.trim(),
          }))
          .filter((note) => note.en || note.ar),

        heart: notes.heart
          .map((note) => ({
            id: note.id,
            en: note.en.trim(),
            ar: note.ar.trim(),
          }))
          .filter((note) => note.en || note.ar),

        base: notes.base
          .map((note) => ({
            id: note.id,
            en: note.en.trim(),
            ar: note.ar.trim(),
          }))
          .filter((note) => note.en || note.ar),
      };

      for (const group of [
        parsedNotes.top,
        parsedNotes.heart,
        parsedNotes.base,
      ]) {
        for (const note of group) {
          if (!note.en || !note.ar) {
            return;
          }
        }
      }

      console.log("Product form:", {
        ...form,
        sizes,
        notes,
      });

      try {
        if (product) {
          // EDIT
          await reconcileProductImages(
            product.id,
            productImages,
          );

          await reconcileProductSizes(
            product.id,
            parsedSizes,
          );

          await reconcileProductNotes(
            product.id,
            parsedNotes,
          );
        } else {
          // CREATE
          const result = await createProduct({
            slug: form.slug,
            gender: form.gender as
              | "women"
              | "men"
              | "unisex",
            isActive: form.isActive,
            featured: form.featured,
            newArrival: form.newArrival,
            bestseller: form.bestseller,
          });

          console.log(
            "Created product:",
            result,
          );

          await saveProductTranslations(
            result.id,
            {
              en: {
                name: form.nameEn,
                brand: form.brandEn,
                description: form.descriptionEn,
                badge: form.badgeEn,
                longevity: form.longevityEn,
                detailsSize: form.detailsSize,
                concentration: form.concentration,
              },
              ar: {
                name: form.nameAr,
                brand: form.brandAr,
                description: form.descriptionAr,
                badge: form.badgeAr,
                longevity: form.longevityAr,
                detailsSize: form.detailsSize,
                concentration: form.concentration,
              },
            },
          );

          await saveProductSizes(
            result.id,
            parsedSizes,
          );

          await saveProductNotes(
            result.id,
            parsedNotes,
          );

          for (const image of productImages) {
            if (!image.file) continue;

            const formData = new FormData();
            formData.append("file", image.file);

            await uploadProductImage(
              result.id,
              formData,
            );
          }

          router.push(
            `/admin/products/${result.id}`,
          );
        }

        router.refresh();
      } catch (error) {
        console.error(error);

        setSaveError(
          error instanceof Error
            ? error.message
            : "Failed to save product.",
        );
      }
    });


  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic information */}
      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-950">
            {t("basicInformation")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("basicInformationDescription")}
          </p>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("nameEn")}
            </label>

            <input
              value={form.nameEn}
              onChange={(event) =>
                updateField("nameEn", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-neutral-400"
              placeholder={t("nameEnPlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("nameAr")}
            </label>

            <input
              dir="rtl"
              value={form.nameAr}
              onChange={(event) =>
                updateField("nameAr", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-neutral-400"
              placeholder={t("nameArPlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("brandEn")}
            </label>

            <input
              value={form.brandEn}
              onChange={(event) =>
                updateField("brandEn", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-neutral-400"
              placeholder={t("brandEnPlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("brandAr")}
            </label>

            <input
              dir="rtl"
              value={form.brandAr}
              onChange={(event) =>
                updateField("brandAr", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-neutral-400"
              placeholder={t("brandArPlaceholder")}
            />
          </div>

          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-neutral-800">
              {t("slug")}
            </label>

            <input
              value={form.slug}
              onChange={(event) =>
                updateField("slug", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-neutral-400"
              placeholder={t("slugPlaceholder")}
            />

            <p className="mt-2 text-xs text-neutral-500">
              {t("slugDescription")}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("gender")}
            </label>

            <select
              value={form.gender}
              onChange={(event) =>
                updateField("gender", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-neutral-400"
            >
              <option value="women">{t("women")}</option>
              <option value="men">{t("men")}</option>
              <option value="unisex">{t("unisex")}</option>
            </select>
          </div>
        </div>
      </section>

      <ProductImageUpload
        existingImages={existingImages}
        onImagesChange={setProductImages}
      />

      {/* Sizes & Pricing */}
      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              {t("sizeManagement")}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {t("sizeManagementDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={addSize}
            className="h-10 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            + {t("addSize")}
          </button>
        </div>

        <div className="space-y-4 p-6">
          {sizes.map((size, index) => (
            <div
              key={size.id}
              className="rounded-xl border border-neutral-200 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-800">
                  {t("size")} {index + 1}
                </p>

                {sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSize(size.id)}
                    className="text-xs font-medium text-neutral-500 transition hover:text-neutral-950"
                  >
                    {t("remove")}
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="text-sm font-medium text-neutral-800">
                    {t("sizeMl")}
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={size.ml}
                    onChange={(event) =>
                      updateSize(
                        size.id,
                        "ml",
                        event.target.value,
                      )
                    }
                    placeholder="50"
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-800">
                    {t("price")}
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={size.price}
                    onChange={(event) =>
                      updateSize(
                        size.id,
                        "price",
                        event.target.value,
                      )
                    }
                    placeholder="0.00"
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-800">
                    {t("compareAtPrice")}
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={size.compareAtPrice}
                    onChange={(event) =>
                      updateSize(
                        size.id,
                        "compareAtPrice",
                        event.target.value,
                      )
                    }
                    placeholder="0.00"
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-800">
                    {t("stockQuantity")}
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={size.stockQuantity}
                    onChange={(event) =>
                      updateSize(
                        size.id,
                        "stockQuantity",
                        event.target.value,
                      )
                    }
                    placeholder="0"
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-950">
            {t("fragranceDetails")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("fragranceDetailsDescription")}
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("concentration")}
            </label>

            <input
              value={form.concentration}
              onChange={(event) =>
                updateField("concentration", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
              placeholder={t("concentrationPlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("detailsSize")}
            </label>

            <input
              value={form.detailsSize}
              onChange={(event) =>
                updateField("detailsSize", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
              placeholder={t("detailsSizePlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("longevityEn")}
            </label>

            <input
              value={form.longevityEn}
              onChange={(event) =>
                updateField("longevityEn", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
              placeholder={t("longevityEnPlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("longevityAr")}
            </label>

            <input
              dir="rtl"
              value={form.longevityAr}
              onChange={(event) =>
                updateField("longevityAr", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
              placeholder={t("longevityArPlaceholder")}
            />
          </div>
        </div>
      </section>

      {/* Descriptions */}
      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-950">
            {t("descriptions")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("descriptionsDescription")}
          </p>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("descriptionEn")}
            </label>

            <textarea
              value={form.descriptionEn}
              onChange={(event) =>
                updateField(
                  "descriptionEn",
                  event.target.value,
                )
              }
              rows={6}
              className="mt-2 w-full resize-y rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-400"
              placeholder={t("descriptionEnPlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("descriptionAr")}
            </label>

            <textarea
              dir="rtl"
              value={form.descriptionAr}
              onChange={(event) =>
                updateField(
                  "descriptionAr",
                  event.target.value,
                )
              }
              rows={6}
              className="mt-2 w-full resize-y rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-400"
              placeholder={t("descriptionArPlaceholder")}
            />
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-950">
            {t("badge")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("badgeDescription")}
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("badgeEn")}
            </label>

            <input
              value={form.badgeEn}
              onChange={(event) =>
                updateField("badgeEn", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
              placeholder={t("badgeEnPlaceholder")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-800">
              {t("badgeAr")}
            </label>

            <input
              dir="rtl"
              value={form.badgeAr}
              onChange={(event) =>
                updateField("badgeAr", event.target.value)
              }
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
              placeholder={t("badgeArPlaceholder")}
            />
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-950">
            {t("fragranceNotes")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("fragranceNotesDescription")}
          </p>
        </div>

        <div className="space-y-8 p-6">
          {(
            [
              ["top", "topNotes"],
              ["heart", "heartNotes"],
              ["base", "baseNotes"],
            ] as const
          ).map(([type, label]) => (
            <div key={type}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900">
                  {t(label)}
                </h3>

                <button
                  type="button"
                  onClick={() => addNote(type)}
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-950"
                >
                  + {t("addNote")}
                </button>
              </div>

              <div className="space-y-3">
                {notes[type].map((note, index) => (
                  <div
                    key={note.id}
                    className="rounded-xl border border-neutral-200 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-neutral-500">
                        {t("note")} {index + 1}
                      </span>

                      {notes[type].length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeNote(type, note.id)
                          }
                          className="text-xs font-medium text-neutral-500 hover:text-neutral-950"
                        >
                          {t("remove")}
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        value={note.en}
                        onChange={(event) =>
                          updateNote(
                            type,
                            note.id,
                            "en",
                            event.target.value,
                          )
                        }
                        placeholder={t("noteEnPlaceholder")}
                        className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
                      />

                      <input
                        dir="rtl"
                        value={note.ar}
                        onChange={(event) =>
                          updateNote(
                            type,
                            note.id,
                            "ar",
                            event.target.value,
                          )
                        }
                        placeholder={t("noteArPlaceholder")}
                        className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm outline-none focus:border-neutral-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Store settings */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950">
            {t("storeSettings")}
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            {t("storeSettingsDescription")}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <label className="flex items-start gap-3 rounded-xl border border-neutral-200 p-4">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                updateField("isActive", event.target.checked)
              }
              className="mt-0.5 size-4 rounded border-neutral-300"
            />

            <span>
              <span className="block text-sm font-medium text-neutral-900">
                {t("isActive")}
              </span>

              <span className="mt-1 block text-xs text-neutral-500">
                {t("isActiveDescription")}
              </span>
            </span>
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  updateField("featured", event.target.checked)
                }
                className="size-4 rounded border-neutral-300"
              />

              <span className="text-sm font-medium text-neutral-900">
                {t("featured")}
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4">
              <input
                type="checkbox"
                checked={form.newArrival}
                onChange={(event) =>
                  updateField("newArrival", event.target.checked)
                }
                className="size-4 rounded border-neutral-300"
              />

              <span className="text-sm font-medium text-neutral-900">
                {t("newArrival")}
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4">
              <input
                type="checkbox"
                checked={form.bestseller}
                onChange={(event) =>
                  updateField("bestseller", event.target.checked)
                }
                className="size-4 rounded border-neutral-300"
              />

              <span className="text-sm font-medium text-neutral-900">
                {t("bestseller")}
              </span>
            </label>
          </div>
        </div>
      </section>

      {saveError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {saveError}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          disabled={isPending}
          type="submit"
          className="h-11 rounded-xl bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          {isPending ? t("saving") : t("saveProduct")}
        </button>
      </div>
    </form>
  );
}