import { createClient } from '@/lib/supabase/server';
import { mapProduct } from '@/lib/products/mapper';
import type { Product } from '@/types/product';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const PRODUCT_SELECT = `
  id,
  slug,
  gender,
  is_active,
  featured,
  new_arrival,
  bestseller,
  created_at,
  product_translations (
    locale,
    name,
    brand,
    description,
    badge,
    longevity,
    details_size,
    concentration
  ),
  product_images (
    id,
    image_url,
    sort_order
  ),
  product_sizes (
    id,
    ml,
    price,
    compare_at_price,
    stock_quantity
  ),
  product_notes (
    id,
    note_type,
    sort_order,
    product_note_translations (
      locale,
      name
    )
  )
`;

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error('Failed to load products:', error);

    throw new Error('Failed to load products.');
  }

  return (data ?? []).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Failed to load product:', error);

    throw new Error('Failed to load product.');
  }

  if (!data) {
    return null;
  }

  return mapProduct(data);
}

export async function getProductSlugs() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const { data, error } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true);

  if (error) {
    console.error('Failed to load product slugs:', error);

    throw new Error('Failed to load product slugs.');
  }

  return data ?? [];
}
