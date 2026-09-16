import type { Product, ProductGender, ProductNoteType } from '@/types/product';

type ProductRow = {
  id: string;
  slug: string;
  gender: ProductGender;
  is_active: boolean;
  featured: boolean;
  new_arrival: boolean;
  bestseller: boolean;
  created_at: string;

  product_translations?: Array<{
    locale: 'en' | 'ar';
    name: string;
    brand: string;
    description: string;
    badge?: string | null;
    longevity?: string | null;
    details_size?: string | null;
    concentration?: string | null;
  }>;

  product_images?: Array<{
    id: string;
    image_url: string;
    sort_order: number;
  }>;

  product_sizes?: Array<{
    id: string;
    ml: number;
    price: number;
    compare_at_price: number | null;
    stock_quantity: number;
  }>;

  product_notes?: Array<{
    id: string;
    note_type: ProductNoteType;
    sort_order: number;
    product_note_translations?: Array<{
      locale: 'en' | 'ar';
      name: string;
    }>;
  }>;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    gender: row.gender,
    isActive: row.is_active,
    featured: row.featured,
    newArrival: row.new_arrival,
    bestseller: row.bestseller,
    createdAt: row.created_at,
    category: null,

    translations: (row.product_translations ?? []).map((translation) => ({
      locale: translation.locale,
      name: translation.name,
      brand: translation.brand,
      description: translation.description,
      badge: translation.badge ?? null,
      longevity: translation.longevity ?? null,
      detailsSize: translation.details_size ?? null,
      concentration: translation.concentration ?? null,
    })),

    images: (row.product_images ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({
        id: image.id,
        imageUrl: image.image_url,
        sortOrder: image.sort_order,
      })),

    sizes: (row.product_sizes ?? []).map((size) => ({
      id: size.id,
      ml: size.ml,
      price: Number(size.price),
      compareAtPrice:
        size.compare_at_price === null ? null : Number(size.compare_at_price),
      stockQuantity: size.stock_quantity,
    })),

    notes: (row.product_notes ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((note) => ({
        id: note.id,
        type: note.note_type,
        sortOrder: note.sort_order,
        translations: (note.product_note_translations ?? []).map(
          (translation) => ({
            locale: translation.locale,
            name: translation.name,
          }),
        ),
      })),
  };
}
