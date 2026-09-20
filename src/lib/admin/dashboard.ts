import { createClient } from '@/lib/supabase/server';
import { DEFAULT_LOW_STOCK_THRESHOLD } from '@/lib/admin/inventory';

export async function getDashboardStats() {
  const supabase = await createClient();

  const [
    productsResult,
    activeProductsResult,
    ordersResult,
    pendingOrdersResult,
    customersResult,
    revenueResult,
    lowStockResult,
    recentOrdersResult,
    inventoryResult,
    salesOverviewResult,
  ] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),

    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),

    supabase.from('orders').select('id', { count: 'exact', head: true }),

    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),

    supabase.from('customers').select('id', { count: 'exact', head: true }),

    supabase.from('orders').select('total').neq('status', 'cancelled'),

    supabase
      .from('product_sizes')
      .select(
        `
    id,
    product_id,
    ml,
    stock_quantity,
    products (
      id,
      product_translations (
        locale,
        name,
        brand
      )
    )
  `,
      )
      .lte('stock_quantity', DEFAULT_LOW_STOCK_THRESHOLD)
      .order('stock_quantity', {
        ascending: true,
      })
      .limit(10),

    supabase
      .from('orders')
      .select(
        `
          id,
          status,
          total,
          customer_name,
          created_at,
          order_number
        `,
      )
      .order('created_at', { ascending: false })
      .limit(5),

    await supabase.from('product_sizes').select('stock_quantity'),

    supabase.rpc('get_dashboard_sales_overview', {
      p_days: 30,
    }),
  ]);

  const errors = [
    productsResult.error,
    activeProductsResult.error,
    ordersResult.error,
    pendingOrdersResult.error,
    customersResult.error,
    revenueResult.error,
    lowStockResult.error,
    recentOrdersResult.error,
    inventoryResult.error,
    salesOverviewResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    throw new Error('Failed to load dashboard statistics.');
  }

  const revenue =
    revenueResult.data?.reduce(
      (sum, order) => sum + Number(order.total ?? 0),
      0,
    ) ?? 0;

  const inventory = inventoryResult.data ?? [];

  const totalInventoryUnits = inventory.reduce(
    (sum, item) => sum + Number(item.stock_quantity ?? 0),
    0,
  );

  const outOfStockVariants = inventory.filter(
    (item) => Number(item.stock_quantity ?? 0) <= 0,
  ).length;

  return {
    products: productsResult.count ?? 0,
    activeProducts: activeProductsResult.count ?? 0,
    orders: ordersResult.count ?? 0,
    pendingOrders: pendingOrdersResult.count ?? 0,
    customers: customersResult.count ?? 0,
    revenue,
    totalInventoryUnits,
    outOfStockVariants,
    lowStock: lowStockResult.data ?? [],
    recentOrders: recentOrdersResult.data ?? [],
    salesOverview: salesOverviewResult.data ?? [],
  };
}
