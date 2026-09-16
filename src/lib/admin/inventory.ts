import { createClient } from '@/lib/supabase/server';

type InventoryFilters = {
  search?: string;
  gender?: string;
  status?: string;
  productStatus?: string;
};

export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export async function getAdminInventory(filters: InventoryFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from('product_sizes')
    .select(
      `
      id,
      product_id,
      ml,
      price,
      compare_at_price,
      stock_quantity,
      products (
        id,
        slug,
        gender,
        is_active,
        product_translations (
          locale,
          name,
          brand
        )
      )
    `,
    )
    .order('stock_quantity', {
      ascending: true,
    });

  if (filters.gender && filters.gender !== 'all') {
    query = query.eq('products.gender', filters.gender);
  }

  if (filters.productStatus === 'active') {
    query = query.eq('products.is_active', true);
  }

  if (filters.productStatus === 'inactive') {
    query = query.eq('products.is_active', false);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Failed to load inventory.');
  }

  let inventory = data ?? [];

  if (filters.search?.trim()) {
    const search = filters.search.trim().toLowerCase();

    inventory = inventory.filter((item) => {
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;

      return product?.product_translations?.some(
        (translation) =>
          translation.name?.toLowerCase().includes(search) ||
          translation.brand?.toLowerCase().includes(search),
      );
    });
  }

  if (filters.status && filters.status !== 'all') {
    inventory = inventory.filter((item) => {
      const status = getInventoryStatus(Number(item.stock_quantity ?? 0));

      return status === filters.status;
    });
  }

  return inventory;
}

export function getInventoryStatus(
  stockQuantity: number,
  lowStockThreshold = DEFAULT_LOW_STOCK_THRESHOLD,
) {
  if (stockQuantity <= 0) {
    return 'out_of_stock';
  }

  if (stockQuantity <= lowStockThreshold) {
    return 'low_stock';
  }

  return 'in_stock';
}

export function getInventorySummary(
  inventory: Array<{
    stock_quantity: number;
  }>,
  lowStockThreshold = DEFAULT_LOW_STOCK_THRESHOLD,
) {
  const totalUnits = inventory.reduce(
    (sum, item) => sum + Number(item.stock_quantity ?? 0),
    0,
  );

  const outOfStock = inventory.filter(
    (item) => Number(item.stock_quantity ?? 0) <= 0,
  ).length;

  const lowStock = inventory.filter((item) => {
    const quantity = Number(item.stock_quantity ?? 0);

    return quantity > 0 && quantity <= lowStockThreshold;
  }).length;

  return {
    totalUnits,
    outOfStock,
    lowStock,
  };
}
