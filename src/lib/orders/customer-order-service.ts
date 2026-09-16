import type { Order, OrderItem, OrderStatus } from '@/types/order';
import type { Product, ProductSize } from '@/types/product';
import { createClient } from '@/lib/supabase/server';

type CustomerOrderRow = {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_method: 'pay_on_delivery';
  payment_status: 'pending' | 'paid';
  delivery_method: 'standard' | 'express';
  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  notes: string | null;
  created_at: string;
  order_items: CustomerOrderItemRow[] | null;
};

type CustomerOrderItemRow = {
  id: string;
  product_id: string | null;
  product_size_id: string | null;
  product_name: Record<string, string> | null;
  size_ml: number | string;
  quantity: number;
  unit_price: number | string;
  subtotal: number | string;
};

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function splitCustomerName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) {
    return {
      firstName: '',
      lastName: '',
    };
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: '',
    };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

function getSnapshotName(productName: Record<string, string> | null): string {
  if (!productName) {
    return 'Product';
  }

  return (
    productName.en ??
    productName.ar ??
    Object.values(productName)[0] ??
    'Product'
  );
}

function buildProduct(item: CustomerOrderItemRow): Product {
  const snapshotName = getSnapshotName(item.product_name);

  return {
    id: item.product_id ?? `order-item-${item.id}`,
    slug: '',
    gender: 'unisex',
    isActive: true,
    featured: false,
    newArrival: false,
    bestseller: false,
    category: null,
    translations: [
      {
        locale: 'en',
        name: item.product_name?.en ?? snapshotName,
        brand: '',
        description: '',
        concentration: null,
        detailsSize: null,
        longevity: null,
        badge: null,
      },
      {
        locale: 'ar',
        name: item.product_name?.ar ?? snapshotName,
        brand: '',
        description: '',
        concentration: null,
        detailsSize: null,
        longevity: null,
        badge: null,
      },
    ],
    images: [],
    sizes: [],
    notes: [],
    createdAt: '',
  };
}

function buildProductSize(item: CustomerOrderItemRow): ProductSize {
  return {
    id: item.product_size_id ?? `order-size-${item.id}`,
    ml: toNumber(item.size_ml),
    price: toNumber(item.unit_price),
    compareAtPrice: null,
    stockQuantity: 0,
  };
}

function mapOrderItem(item: CustomerOrderItemRow): OrderItem {
  return {
    product: buildProduct(item),
    size: buildProductSize(item),
    quantity: item.quantity,
    unitPrice: toNumber(item.unit_price),
    lineTotal: toNumber(item.subtotal),
  };
}

function mapOrder(row: CustomerOrderRow): Order {
  const { firstName, lastName } = splitCustomerName(row.customer_name);

  const items = (row.order_items ?? []).map(mapOrderItem);

  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: null,
    customer: {
      firstName,
      lastName,
      phone: row.customer_phone,
      email: '',
    },
    deliveryAddress: {
      address: row.delivery_address,
      city: row.delivery_city,
      notes: row.notes ?? '',
    },
    deliveryMethod: row.delivery_method,
    deliveryCost: toNumber(row.delivery_fee),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    items,
    subtotal: toNumber(row.subtotal),
    total: toNumber(row.total),
    status: row.status,
    createdAt: row.created_at,
  };
}

const orderSelect = `
  id,
  order_number,
  status,
  payment_method,
  payment_status,
  delivery_method,
  subtotal,
  delivery_fee,
  total,
  customer_name,
  customer_phone,
  delivery_address,
  delivery_city,
  notes,
  created_at,
  order_items (
    id,
    product_id,
    product_size_id,
    product_name,
    size_ml,
    quantity,
    unit_price,
    subtotal
  )
`;

export async function getCustomerOrders(): Promise<Order[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select(orderSelect)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load customer orders:', error);
    throw new Error('Unable to load your orders.');
  }

  return ((data ?? []) as CustomerOrderRow[]).map(mapOrder);
}

export async function getCustomerOrder(
  orderNumber: string,
): Promise<Order | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const normalizedOrderNumber = orderNumber.trim();

  if (!normalizedOrderNumber) {
    return null;
  }

  const { data, error } = await supabase
    .from('orders')
    .select(orderSelect)
    .eq('order_number', normalizedOrderNumber)
    .maybeSingle();

  if (error) {
    console.error('Failed to load customer order:', error);
    throw new Error('Unable to load this order.');
  }

  if (!data) {
    return null;
  }

  return mapOrder(data as CustomerOrderRow);
}

// import { createClient } from '@/lib/supabase/server';
// import type { Order, OrderCustomer, OrderItem } from '@/types/order';
// import type { Product, ProductSize } from '@/types/product';

// type OrderRow = {
//   id: string;
//   order_number: string;
//   customer_id: string | null;
//   status: Order['status'];
//   payment_method: string;
//   payment_status: Order['paymentStatus'];
//   delivery_method: Order['deliveryMethod'];
//   subtotal: number | string;
//   delivery_fee: number | string;
//   total: number | string;
//   customer_name: string;
//   customer_phone: string;
//   delivery_address: string;
//   delivery_city: string;
//   notes: string | null;
//   created_at: string;
//   order_items: OrderItemRow[];
// };

// type OrderItemRow = {
//   id: string;
//   product_id: string | null;
//   product_size_id: string | null;
//   product_name: Record<string, string>;
//   size_ml: number;
//   quantity: number;
//   unit_price: number | string;
//   subtotal: number | string;

//   /*
//    * These are intentionally optional.
//    *
//    * The product or product size may have been deleted because
//    * the database relationships use ON DELETE SET NULL.
//    */
//   product?: ProductRow | null;
//   product_size?: ProductSizeRow | null;
// };

// type ProductRow = {
//   id: string;
//   slug: string;
//   gender: Product['gender'];
//   is_active: boolean;
//   featured: boolean;
//   new_arrival: boolean;
//   bestseller: boolean;
//   created_at: string;
// };

// type ProductSizeRow = {
//   id: string;
//   ml: number;
//   price: number | string;
//   compare_at_price: number | string | null;
//   stock_quantity: number;
// };

// type CustomerRow = {
//   id: string;
//   first_name: string;
//   last_name: string;
//   phone: string;
//   email: string | null;
// };

// export async function getCustomerOrders(): Promise<Order[]> {
//   const supabase = await createClient();

//   /*
//    * =========================================================
//    * AUTHENTICATED USER
//    * =========================================================
//    *
//    * We identify the customer from the current Supabase
//    * session. Nothing comes from the browser.
//    */
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError) {
//     console.error('Failed to get authenticated user:', userError);

//     return [];
//   }

//   if (!user) {
//     return [];
//   }

//   /*
//    * =========================================================
//    * CUSTOMER PROFILE
//    * =========================================================
//    *
//    * orders.customer_id references customers.id, not
//    * auth.users.id.
//    */
//   const { data: customer, error: customerError } = await supabase
//     .from('customers')
//     .select('id, first_name, last_name, phone, email')
//     .eq('user_id', user.id)
//     .maybeSingle();

//   if (customerError) {
//     console.error('Failed to get customer profile for orders:', customerError);

//     return [];
//   }

//   if (!customer) {
//     return [];
//   }

//   /*
//    * =========================================================
//    * CUSTOMER ORDERS
//    * =========================================================
//    *
//    * The customer_id filter is the important security boundary
//    * at this application layer.
//    */
//   const { data: orders, error: ordersError } = await supabase
//     .from('orders')
//     .select(
//       `
//           id,
//           order_number,
//           customer_id,
//           status,
//           payment_method,
//           payment_status,
//           delivery_method,
//           subtotal,
//           delivery_fee,
//           total,
//           customer_name,
//           customer_phone,
//           delivery_address,
//           notes,
//           created_at,
//           order_items (
//             id,
//             product_id,
//             product_size_id,
//             product_name,
//             size_ml,
//             quantity,
//             unit_price,
//             subtotal
//           )
//         `,
//     )
//     .eq('customer_id', customer.id)
//     .order('created_at', {
//       ascending: false,
//     });

//   if (ordersError) {
//     console.error('Failed to get customer orders:', ordersError);

//     return [];
//   }

//   if (!orders) {
//     return [];
//   }

//   /*
//    * =========================================================
//    * MAP DATABASE ROWS -> EXISTING Order TYPE
//    * =========================================================
//    */
//   return orders.map((order) =>
//     mapOrderRow(order as unknown as OrderRow, customer as CustomerRow),
//   );
// }

// /**
//  * Maps one Supabase order row into the existing frontend
//  * Order model.
//  */
// function mapOrderRow(row: OrderRow, customer: CustomerRow): Order {
//   const customerNameParts = splitCustomerName(row.customer_name);

//   const orderCustomer: OrderCustomer = {
//     firstName: customer.first_name || customerNameParts.firstName,
//     lastName: customer.last_name || customerNameParts.lastName,
//     phone: row.customer_phone,
//     email: customer.email ?? '',
//   };

//   const items: OrderItem[] = row.order_items.map((item) => mapOrderItem(item));

//   return {
//     id: row.id,

//     orderNumber: row.order_number,

//     customerId: row.customer_id,

//     customer: orderCustomer,

//     /*
//      * The database currently stores the complete delivery
//      * address in one column:
//      *
//      *   "address, city"
//      *
//      * We intentionally do not attempt fragile parsing here.
//      */
//     deliveryAddress: {
//       address: row.delivery_address,
//       city: row.delivery_city,
//       notes: row.notes ?? '',
//     },

//     deliveryMethod: row.delivery_method,

//     deliveryCost: toNumber(row.delivery_fee),

//     paymentMethod: normalizePaymentMethod(row.payment_method),

//     paymentStatus: normalizePaymentStatus(row.payment_status),

//     items,

//     subtotal: toNumber(row.subtotal),

//     total: toNumber(row.total),

//     status: row.status,

//     createdAt: row.created_at,
//   };
// }

// /**
//  * Maps an order_items database row into the existing
//  * frontend OrderItem type.
//  *
//  * Product and size records are reconstructed as lightweight
//  * objects because the current order_items query does not
//  * require the full product catalogue.
//  *
//  * The order's product_name JSONB remains the authoritative
//  * historical product-name snapshot.
//  */
// function mapOrderItem(row: OrderItemRow): OrderItem {
//   const product = createProductFromOrderItem(row);

//   const size = createProductSizeFromOrderItem(row);

//   return {
//     product,

//     size,

//     quantity: row.quantity,

//     unitPrice: toNumber(row.unit_price),

//     lineTotal: toNumber(row.subtotal),
//   };
// }

// /**
//  * Creates the Product shape expected by OrderItem.
//  *
//  * If the original product still exists, we use its database
//  * identity fields. If it was deleted, we create a minimal
//  * fallback object so historical orders remain renderable.
//  */
// function createProductFromOrderItem(row: OrderItemRow): Product {
//   if (row.product) {
//     return {
//       id: row.product.id,
//       slug: row.product.slug,
//       gender: row.product.gender,
//       isActive: row.product.is_active,
//       featured: row.product.featured,
//       newArrival: row.product.new_arrival,
//       bestseller: row.product.bestseller,
//       category: null,
//       translations: [],
//       images: [],
//       sizes: [],
//       notes: [],
//       createdAt: row.product.created_at,
//     };
//   }

//   return {
//     id: row.product_id ?? `deleted-${row.id}`,
//     slug: '',
//     gender: 'unisex',
//     isActive: false,
//     featured: false,
//     newArrival: false,
//     bestseller: false,
//     category: null,
//     translations: createTranslationsFromSnapshot(row.product_name),
//     images: [],
//     sizes: [],
//     notes: [],
//     createdAt: '',
//   };
// }

// /**
//  * Creates the ProductSize shape expected by OrderItem.
//  */
// function createProductSizeFromOrderItem(row: OrderItemRow): ProductSize {
//   if (row.product_size) {
//     return {
//       id: row.product_size.id,
//       ml: row.product_size.ml,
//       price: toNumber(row.product_size.price),
//       compareAtPrice:
//         row.product_size.compare_at_price === null
//           ? null
//           : toNumber(row.product_size.compare_at_price),
//       stockQuantity: row.product_size.stock_quantity,
//     };
//   }

//   /*
//    * The size is a historical snapshot.
//    *
//    * We deliberately use the order item's stored size_ml and
//    * unit_price rather than depending on today's catalogue.
//    */
//   return {
//     id: row.product_size_id ?? `deleted-${row.id}`,
//     ml: row.size_ml,
//     price: toNumber(row.unit_price),
//     compareAtPrice: null,
//     stockQuantity: 0,
//   };
// }

// /**
//  * Reconstructs the ProductTranslation[] structure from the
//  * historical product_name JSONB snapshot.
//  */
// function createTranslationsFromSnapshot(
//   snapshot: Record<string, string>,
// ): Product['translations'] {
//   return Object.entries(snapshot)
//     .filter(
//       ([locale, name]) =>
//         (locale === 'en' || locale === 'ar') && Boolean(name?.trim()),
//     )
//     .map(([locale, name]) => ({
//       locale: locale as 'en' | 'ar',
//       name,
//       brand: '',
//       description: '',
//       concentration: null,
//       detailsSize: null,
//       longevity: null,
//       badge: null,
//     }));
// }

// function splitCustomerName(name: string): {
//   firstName: string;
//   lastName: string;
// } {
//   const parts = name.trim().split(/\s+/);

//   if (parts.length === 0) {
//     return {
//       firstName: '',
//       lastName: '',
//     };
//   }

//   if (parts.length === 1) {
//     return {
//       firstName: parts[0],
//       lastName: '',
//     };
//   }

//   return {
//     firstName: parts[0],
//     lastName: parts.slice(1).join(' '),
//   };
// }

// function toNumber(value: number | string): number {
//   return typeof value === 'number' ? value : Number(value);
// }

// function normalizePaymentMethod(value: string): Order['paymentMethod'] {
//   if (value === 'pay_on_delivery') {
//     return 'pay_on_delivery';
//   }

//   /*
//    * The database currently only supports pay_on_delivery.
//    *
//    * This fallback keeps the mapper defensive without
//    * expanding the frontend PaymentMethod union.
//    */
//   return 'pay_on_delivery';
// }

// function normalizePaymentStatus(value: string): Order['paymentStatus'] {
//   return value === 'paid' ? 'paid' : 'pending';
// }
