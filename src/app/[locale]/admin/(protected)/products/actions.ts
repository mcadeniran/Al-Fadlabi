'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export async function toggleProductActive(
  productId: string,
  isActive: boolean,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .update({
      is_active: isActive,
    })
    .eq('id', productId);

  if (error) {
    throw new Error('Failed to update product status.');
  }

  revalidatePath('/admin/products');
  revalidatePath('/ar/admin/products');
}

export async function updateProductFlags(
  productId: string,
  flags: {
    featured?: boolean;
    new_arrival?: boolean;
    bestseller?: boolean;
  },
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .update(flags)
    .eq('id', productId);

  if (error) {
    throw new Error('Failed to update product flags.');
  }

  revalidatePath('/admin/products');
  revalidatePath('/ar/admin/products');
}

export async function addProductSize(
  productId: string,
  size: {
    ml: number;
    price: number;
    compareAtPrice?: number;
    stockQuantity: number;
  },
) {
  if (!Number.isInteger(size.ml) || size.ml <= 0) {
    throw new Error('Invalid size.');
  }

  if (!Number.isFinite(size.price) || size.price < 0) {
    throw new Error('Invalid price.');
  }

  if (
    size.compareAtPrice !== undefined &&
    (!Number.isFinite(size.compareAtPrice) || size.compareAtPrice < 0)
  ) {
    throw new Error('Invalid compare-at price.');
  }

  if (!Number.isInteger(size.stockQuantity) || size.stockQuantity < 0) {
    throw new Error('Invalid stock quantity.');
  }

  const supabase = await createClient();

  const { error } = await supabase.from('product_sizes').insert({
    product_id: productId,
    ml: size.ml,
    price: size.price,
    compare_at_price: size.compareAtPrice ?? null,
    stock_quantity: size.stockQuantity,
  });

  if (error) {
    throw new Error('Failed to add product size.');
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/ar/admin/products/${productId}`);
}

export async function updateProductSize(
  sizeId: string,
  productId: string,
  size: {
    ml: number;
    price: number;
    compareAtPrice?: number;
    stockQuantity: number;
  },
) {
  if (!Number.isInteger(size.ml) || size.ml <= 0) {
    throw new Error('Invalid size.');
  }

  if (!Number.isFinite(size.price) || size.price < 0) {
    throw new Error('Invalid price.');
  }

  if (
    size.compareAtPrice !== undefined &&
    (!Number.isFinite(size.compareAtPrice) || size.compareAtPrice < 0)
  ) {
    throw new Error('Invalid compare-at price.');
  }

  if (!Number.isInteger(size.stockQuantity) || size.stockQuantity < 0) {
    throw new Error('Invalid stock quantity.');
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('product_sizes')
    .update({
      ml: size.ml,
      price: size.price,
      compare_at_price: size.compareAtPrice ?? null,
      stock_quantity: size.stockQuantity,
    })
    .eq('id', sizeId)
    .eq('product_id', productId);

  if (error) {
    throw new Error('Failed to update product size.');
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/ar/admin/products/${productId}`);
}

export async function deleteProductSize(sizeId: string, productId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('product_sizes')
    .delete()
    .eq('id', sizeId)
    .eq('product_id', productId);

  if (error) {
    throw new Error('Failed to delete product size.');
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/ar/admin/products/${productId}`);

  revalidatePath('/admin/inventory');
  revalidatePath('/ar/admin/inventory');
}

export async function createProduct(input: {
  slug: string;
  gender: 'women' | 'men' | 'unisex';
  isActive: boolean;
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
}) {
  const slug = input.slug.trim().toLowerCase();

  if (!slug) {
    throw new Error('Product slug is required.');
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      'Product slug can only contain lowercase letters, numbers, and hyphens.',
    );
  }

  if (!['women', 'men', 'unisex'].includes(input.gender)) {
    throw new Error('Invalid product gender.');
  }

  const supabase = await createClient();

  const { data: existingProduct, error: existingError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existingError) {
    throw new Error('Failed to validate product slug.');
  }

  if (existingProduct) {
    throw new Error('A product with this slug already exists.');
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      slug,
      gender: input.gender,
      is_active: input.isActive,
      featured: input.featured,
      new_arrival: input.newArrival,
      bestseller: input.bestseller,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error('Failed to create product.');
  }

  revalidatePath('/admin/products');
  revalidatePath('/ar/admin/products');

  return data;
}

export async function saveProductTranslations(
  productId: string,
  translations: {
    en: {
      name: string;
      brand: string;
      description: string;
      badge?: string;
      longevity?: string;
      detailsSize?: string;
      concentration?: string;
    };
    ar: {
      name: string;
      brand: string;
      description: string;
      badge?: string;
      longevity?: string;
      detailsSize?: string;
      concentration?: string;
    };
  },
) {
  if (!productId) {
    throw new Error('Product ID is required.');
  }

  const enName = translations.en.name.trim();
  const arName = translations.ar.name.trim();
  const enBrand = translations.en.brand.trim();
  const arBrand = translations.ar.brand.trim();
  const enDescription = translations.en.description.trim();
  const arDescription = translations.ar.description.trim();

  if (!enName || !arName) {
    throw new Error('Product name is required in English and Arabic.');
  }

  if (!enBrand || !arBrand) {
    throw new Error('Product brand is required in English and Arabic.');
  }

  if (!enDescription || !arDescription) {
    throw new Error('Product description is required in English and Arabic.');
  }

  const rows = [
    {
      product_id: productId,
      locale: 'en' as const,
      name: enName,
      brand: enBrand,
      description: enDescription,
      badge: translations.en.badge?.trim() || null,
      longevity: translations.en.longevity?.trim() || null,
      details_size: translations.en.detailsSize?.trim() || null,
      concentration: translations.en.concentration?.trim() || null,
    },
    {
      product_id: productId,
      locale: 'ar' as const,
      name: arName,
      brand: arBrand,
      description: arDescription,
      badge: translations.ar.badge?.trim() || null,
      longevity: translations.ar.longevity?.trim() || null,
      details_size: translations.ar.detailsSize?.trim() || null,
      concentration: translations.ar.concentration?.trim() || null,
    },
  ];

  const { error } = await (await createClient())
    .from('product_translations')
    .upsert(rows, {
      onConflict: 'product_id,locale',
    });

  if (error) {
    throw new Error('Failed to save product translations.');
  }

  revalidatePath('/admin/products');
  revalidatePath('/ar/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/ar/admin/products/${productId}`);
}

export async function saveProductSizes(
  productId: string,
  sizes: Array<{
    ml: number;
    price: number;
    compareAtPrice?: number;
    stockQuantity: number;
  }>,
) {
  if (!productId) {
    throw new Error('Product ID is required.');
  }

  const normalizedSizes = sizes.map((size) => ({
    product_id: productId,
    ml: size.ml,
    price: size.price,
    compare_at_price: size.compareAtPrice ?? null,
    stock_quantity: size.stockQuantity,
  }));

  if (normalizedSizes.length === 0) {
    throw new Error('At least one product size is required.');
  }

  const seenSizes = new Set<number>();

  for (const size of normalizedSizes) {
    if (!Number.isInteger(size.ml) || size.ml <= 0) {
      throw new Error('Invalid product size.');
    }

    if (seenSizes.has(size.ml)) {
      throw new Error('Duplicate product size.');
    }

    seenSizes.add(size.ml);

    if (!Number.isFinite(size.price) || size.price < 0) {
      throw new Error('Invalid product price.');
    }

    if (
      size.compare_at_price !== null &&
      (!Number.isFinite(size.compare_at_price) || size.compare_at_price < 0)
    ) {
      throw new Error('Invalid compare-at price.');
    }

    if (!Number.isInteger(size.stock_quantity) || size.stock_quantity < 0) {
      throw new Error('Invalid stock quantity.');
    }
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('product_sizes')
    .insert(normalizedSizes);

  if (error) {
    throw new Error('Failed to save product sizes.');
  }

  revalidatePath('/admin/products');
  revalidatePath('/ar/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/ar/admin/products/${productId}`);
  revalidatePath('/admin/inventory');
  revalidatePath('/ar/admin/inventory');
}

export async function saveProductNotes(
  productId: string,
  notes: {
    top: Array<{
      en: string;
      ar: string;
    }>;
    heart: Array<{
      en: string;
      ar: string;
    }>;
    base: Array<{
      en: string;
      ar: string;
    }>;
  },
) {
  if (!productId) {
    throw new Error('Product ID is required.');
  }

  const groups = [
    {
      type: 'top' as const,
      notes: notes.top,
    },
    {
      type: 'heart' as const,
      notes: notes.heart,
    },
    {
      type: 'base' as const,
      notes: notes.base,
    },
  ];

  const supabase = await createClient();

  for (const group of groups) {
    for (let index = 0; index < group.notes.length; index++) {
      const note = group.notes[index];

      const en = note.en.trim();
      const ar = note.ar.trim();

      if (!en && !ar) {
        continue;
      }

      if (!en || !ar) {
        throw new Error(
          'Each fragrance note requires English and Arabic names.',
        );
      }

      const { data: noteRow, error: noteError } = await supabase
        .from('product_notes')
        .insert({
          product_id: productId,
          note_type: group.type,
          sort_order: index,
        })
        .select('id')
        .single();

      if (noteError) {
        throw new Error('Failed to save fragrance note.');
      }

      const { error: translationError } = await supabase
        .from('product_note_translations')
        .insert([
          {
            note_id: noteRow.id,
            locale: 'en',
            name: en,
          },
          {
            note_id: noteRow.id,
            locale: 'ar',
            name: ar,
          },
        ]);

      if (translationError) {
        throw new Error('Failed to save fragrance note translations.');
      }
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/ar/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/ar/admin/products/${productId}`);
}

export async function uploadProductImage(
  productId: string,
  formData: FormData,
) {
  if (!productId) {
    throw new Error('Product ID is required.');
  }

  const file = formData.get('file');

  if (!(file instanceof File)) {
    throw new Error('Image file is required.');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be smaller than 5MB.');
  }

  const supabase = await createClient();

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

  const fileName = `${crypto.randomUUID()}.${extension}`;
  const filePath = `${productId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.log('UPLOAD ERROR: ', uploadError.message);
    throw new Error('Failed to upload product image.');
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('product-images').getPublicUrl(filePath);

  const { data: imageRow, error: imageError } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: publicUrl,
      sort_order: 0,
    })
    .select('id, image_url')
    .single();

  if (imageError) {
    console.log('CONSOLE ERROR: ', imageError.message);
    await supabase.storage.from('product-images').remove([filePath]);

    throw new Error('Failed to save product image record.');
  }

  revalidatePath('/admin/products');
  revalidatePath('/ar/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/ar/admin/products/${productId}`);

  return imageRow;
}

async function deleteProductStorageImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string,
) {
  const marker = '/storage/v1/object/public/product-images/';

  const index = imageUrl.indexOf(marker);

  if (index === -1) {
    return;
  }

  const filePath = imageUrl.slice(index + marker.length);

  if (!filePath) {
    return;
  }

  await supabase.storage.from('product-images').remove([filePath]);
}

export async function reconcileProductImages(
  productId: string,
  images: Array<{
    id: string;
    existing: boolean;
    imageUrl?: string;
    file?: File;
    isPrimary: boolean;
  }>,
) {
  if (!productId) {
    throw new Error('Product ID is required.');
  }

  const supabase = await createClient();

  if (images.length > 0) {
    const primaryImages = images.filter((image) => image.isPrimary);

    if (primaryImages.length !== 1) {
      throw new Error('A product must have exactly one primary image.');
    }
  }

  const { data: existingRows, error: existingError } = await supabase
    .from('product_images')
    .select('id, image_url, sort_order')
    .eq('product_id', productId)
    .order('sort_order', {
      ascending: true,
    });

  if (existingError) {
    throw new Error('Failed to load existing product images.');
  }

  const currentRows = existingRows ?? [];

  const currentIds = new Set(
    images.filter((image) => image.existing).map((image) => image.id),
  );

  const removedRows = currentRows.filter((row) => !currentIds.has(row.id));

  // 1. Delete images removed from the editor.
  for (const row of removedRows) {
    await deleteProductStorageImage(supabase, row.image_url);

    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', row.id)
      .eq('product_id', productId);

    if (error) {
      throw new Error('Failed to delete product image.');
    }
  }

  // 2. Upload new images.
  const finalImages: Array<{
    id: string;
    imageUrl: string;
    isPrimary: boolean;
  }> = [];

  for (const image of images) {
    if (image.existing) {
      if (!image.imageUrl) {
        throw new Error('Existing product image URL is missing.');
      }

      finalImages.push({
        id: image.id,
        imageUrl: image.imageUrl,
        isPrimary: image.isPrimary,
      });

      continue;
    }

    if (!image.file) {
      throw new Error('New product image file is missing.');
    }

    if (!image.file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed.');
    }

    if (image.file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be smaller than 5MB.');
    }

    const extension = image.file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath = `${productId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, image.file, {
        contentType: image.file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error('Failed to upload product image.');
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(filePath);

    const { data: insertedRow, error } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        image_url: publicUrl,
        sort_order: 0,
      })
      .select('id')
      .single();

    if (error) {
      await supabase.storage.from('product-images').remove([filePath]);

      throw new Error('Failed to save product image.');
    }

    finalImages.push({
      id: insertedRow.id,
      imageUrl: publicUrl,
      isPrimary: image.isPrimary,
    });
  }

  // 3. Reorder everything according to the UI.
  const orderedImages = [...finalImages].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });

  // 4. Persist the final image order.

  for (let index = 0; index < orderedImages.length; index++) {
    const image = orderedImages[index];

    const { error } = await supabase
      .from('product_images')
      .update({
        sort_order: index,
      })
      .eq('id', image.id)
      .eq('product_id', productId);

    if (error) {
      throw new Error('Failed to update product image order.');
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/ar/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/ar/admin/products/${productId}`);

  return orderedImages;
}

export async function reconcileProductSizes(
  productId: string,
  sizes: Array<{
    id: string;
    ml: number;
    price: number;
    compareAtPrice?: number;
    stockQuantity: number;
  }>,
) {
  if (!productId) {
    throw new Error('Product ID is required.');
  }

  if (sizes.length === 0) {
    throw new Error('At least one product size is required.');
  }

  const seenMl = new Set<number>();

  for (const size of sizes) {
    if (!Number.isInteger(size.ml) || size.ml <= 0) {
      throw new Error('Invalid product size.');
    }

    if (seenMl.has(size.ml)) {
      throw new Error('Duplicate product size.');
    }

    seenMl.add(size.ml);

    if (!Number.isFinite(size.price) || size.price < 0) {
      throw new Error('Invalid product price.');
    }

    if (size.compareAtPrice !== undefined) {
      if (!Number.isFinite(size.compareAtPrice) || size.compareAtPrice < 0) {
        throw new Error('Invalid compare-at price.');
      }

      if (size.compareAtPrice < size.price) {
        throw new Error(
          'Compare-at price cannot be lower than the selling price.',
        );
      }
    }

    if (!Number.isInteger(size.stockQuantity) || size.stockQuantity < 0) {
      throw new Error('Invalid stock quantity.');
    }
  }

  const supabase = await createClient();

  const { data: existingSizes, error: fetchError } = await supabase
    .from('product_sizes')
    .select('id, product_id, ml, price, compare_at_price, stock_quantity')
    .eq('product_id', productId);

  if (fetchError) {
    throw new Error('Failed to load existing product sizes.');
  }

  const existingRows = existingSizes ?? [];

  const existingIds = new Set(
    sizes
      .filter((size) => existingRows.some((row) => row.id === size.id))
      .map((size) => size.id),
  );

  // Delete sizes removed from the editor.
  const removedRows = existingRows.filter((row) => !existingIds.has(row.id));

  if (removedRows.length > 0) {
    const removedIds = removedRows.map((row) => row.id);

    const { error: deleteError } = await supabase
      .from('product_sizes')
      .delete()
      .in('id', removedIds)
      .eq('product_id', productId);

    if (deleteError) {
      throw new Error('Failed to delete product sizes.');
    }
  }

  // Update existing sizes and insert new sizes.
  for (const size of sizes) {
    const isExisting = existingRows.some((row) => row.id === size.id);

    if (isExisting) {
      const { error: updateError } = await supabase
        .from('product_sizes')
        .update({
          ml: size.ml,
          price: size.price,
          compare_at_price: size.compareAtPrice ?? null,
          stock_quantity: size.stockQuantity,
        })
        .eq('id', size.id)
        .eq('product_id', productId);

      if (updateError) {
        throw new Error('Failed to update product size.');
      }

      continue;
    }

    const { error: insertError } = await supabase.from('product_sizes').insert({
      product_id: productId,
      ml: size.ml,
      price: size.price,
      compare_at_price: size.compareAtPrice ?? null,
      stock_quantity: size.stockQuantity,
    });

    if (insertError) {
      throw new Error('Failed to add product size.');
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/ar/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/ar/admin/products/${productId}`);
  revalidatePath('/admin/inventory');
  revalidatePath('/ar/admin/inventory');
}

export async function reconcileProductNotes(
  productId: string,
  notes: {
    top: Array<{
      id: string;
      en: string;
      ar: string;
    }>;
    heart: Array<{
      id: string;
      en: string;
      ar: string;
    }>;
    base: Array<{
      id: string;
      en: string;
      ar: string;
    }>;
  },
) {
  if (!productId) {
    throw new Error('Product ID is required.');
  }

  const groups = [
    { type: 'top' as const, notes: notes.top },
    { type: 'heart' as const, notes: notes.heart },
    { type: 'base' as const, notes: notes.base },
  ];

  const supabase = await createClient();

  const { data: existingNotes, error: fetchError } = await supabase
    .from('product_notes')
    .select(
      `
        id,
        product_id,
        note_type,
        sort_order,
        product_note_translations (
          locale,
          name
        )
      `,
    )
    .eq('product_id', productId);

  if (fetchError) {
    throw new Error('Failed to load existing fragrance notes.');
  }

  const existingRows = existingNotes ?? [];

  const submittedIds = new Set(
    groups.flatMap((group) =>
      group.notes
        .filter((note) => existingRows.some((row) => row.id === note.id))
        .map((note) => note.id),
    ),
  );

  // 1. Delete notes removed from the editor.
  const removedRows = existingRows.filter((row) => !submittedIds.has(row.id));

  for (const row of removedRows) {
    const { error: translationDeleteError } = await supabase
      .from('product_note_translations')
      .delete()
      .eq('note_id', row.id);

    if (translationDeleteError) {
      throw new Error('Failed to delete fragrance note translations.');
    }

    const { error: noteDeleteError } = await supabase
      .from('product_notes')
      .delete()
      .eq('id', row.id)
      .eq('product_id', productId);

    if (noteDeleteError) {
      throw new Error('Failed to delete fragrance note.');
    }
  }

  // 2. Update existing notes and insert new notes.
  for (const group of groups) {
    for (let index = 0; index < group.notes.length; index++) {
      const note = group.notes[index];

      const en = note.en.trim();
      const ar = note.ar.trim();

      if (!en && !ar) {
        continue;
      }

      if (!en || !ar) {
        throw new Error(
          'Each fragrance note requires English and Arabic names.',
        );
      }

      const isExisting = existingRows.some(
        (row) => row.id === note.id && row.product_id === productId,
      );

      if (isExisting) {
        const { error: noteError } = await supabase
          .from('product_notes')
          .update({
            note_type: group.type,
            sort_order: index,
          })
          .eq('id', note.id)
          .eq('product_id', productId);

        if (noteError) {
          throw new Error('Failed to update fragrance note.');
        }

        const { error: translationError } = await supabase
          .from('product_note_translations')
          .upsert(
            [
              {
                note_id: note.id,
                locale: 'en',
                name: en,
              },
              {
                note_id: note.id,
                locale: 'ar',
                name: ar,
              },
            ],
            {
              onConflict: 'note_id,locale',
            },
          );

        if (translationError) {
          throw new Error('Failed to update fragrance note translations.');
        }

        continue;
      }

      // New note
      const { data: noteRow, error: noteError } = await supabase
        .from('product_notes')
        .insert({
          product_id: productId,
          note_type: group.type,
          sort_order: index,
        })
        .select('id')
        .single();

      if (noteError) {
        throw new Error('Failed to add fragrance note.');
      }

      const { error: translationError } = await supabase
        .from('product_note_translations')
        .insert([
          {
            note_id: noteRow.id,
            locale: 'en',
            name: en,
          },
          {
            note_id: noteRow.id,
            locale: 'ar',
            name: ar,
          },
        ]);

      if (translationError) {
        throw new Error('Failed to save fragrance note translations.');
      }
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/ar/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/ar/admin/products/${productId}`);
}
