import { createClient } from '@/lib/supabase/server';
import { mapProduct } from '../products/mapper';

type ProductFilters = {
  search?: string;
  gender?: string;
  status?: string;
  tag?: string;
};

const PRODUCT_SELECT = `
  id,
  slug,
  gender,
  featured,
  new_arrival,
  bestseller,
  is_active,
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
  product_sizes (
    id,
    ml,
    price,
    compare_at_price,
    stock_quantity
  ),
  product_images (
    id,
    image_url,
    sort_order
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

export async function getAdminProducts(filters: ProductFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('created_at', {
      ascending: false,
    });

  if (filters.gender && filters.gender !== 'all') {
    query = query.eq('gender', filters.gender);
  }

  if (filters.status === 'active') {
    query = query.eq('is_active', true);
  }

  if (filters.status === 'inactive') {
    query = query.eq('is_active', false);
  }

  if (filters.tag === 'featured') {
    query = query.eq('featured', true);
  }

  if (filters.tag === 'new_arrival') {
    query = query.eq('new_arrival', true);
  }

  if (filters.tag === 'bestseller') {
    query = query.eq('bestseller', true);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Failed to load products.');
  }

  let products = (data ?? []).map(mapProduct);

  if (filters.search?.trim()) {
    const search = filters.search.trim().toLowerCase();

    products = products.filter((product) =>
      product.translations.some((translation) =>
        [translation.name, translation.brand, translation.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search)),
      ),
    );
  }

  return products;
}

export async function getAdminProduct(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', productId)
    .single();

  if (error) {
    throw new Error('Failed to load product.');
  }

  if (!data) {
    throw new Error('Product not found.');
  }

  return mapProduct(data);
}
