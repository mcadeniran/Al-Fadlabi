import type { CartItem } from '@/components/cart/cart-provider';
import type {
  DeliveryMethod,
  Order,
  OrderAddress,
  OrderCustomer,
} from '@/types/order';
import { createClient } from '@/lib/supabase/client';

type PlaceOrderInput = {
  customer: OrderCustomer;
  deliveryAddress: OrderAddress;
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
};

type CreateCustomerOrderResponse = {
  id: string;
  order_number: string;
  guest_access_token: string | null;
};

export type PlacedOrder = Order & {
  guestAccessToken: string | null;
};

export async function placeOrder({
  customer,
  deliveryAddress,
  items,
  deliveryMethod,
  deliveryCost,
}: PlaceOrderInput): Promise<PlacedOrder> {
  if (items.length === 0) {
    throw new Error('Cannot place an empty order.');
  }

  const supabase = createClient();

  const orderItems = items.map((item) => {
    const productName = getProductNameSnapshot(item);

    return {
      product_id: item.product.id,
      product_size_id: item.size.id,
      product_name: productName,
      product_image_url: item.product.images[0].imageUrl ?? null,
      size_ml: item.size.ml,
      quantity: item.quantity,
      unit_price: item.size.price,
    };
  });

  const { data, error } = await supabase.rpc('create_customer_order', {
    p_customer_first_name: customer.firstName.trim(),
    p_customer_last_name: customer.lastName.trim(),
    p_customer_phone: customer.phone.trim(),
    p_customer_email: customer.email.trim().toLowerCase(),
    p_delivery_address: deliveryAddress.address.trim(),
    p_city: deliveryAddress.city.trim(),
    p_notes: deliveryAddress.notes.trim(),
    p_delivery_method: deliveryMethod,
    p_delivery_fee: deliveryCost,
    p_items: orderItems,
  });

  if (error) {
    console.error('Failed to create Supabase order:', error);

    throw new Error(
      error.message || 'Unable to place your order. Please try again.',
    );
  }

  const createdOrder = extractCreatedOrder(data);

  if (!createdOrder) {
    throw new Error(
      'The order was created, but no order confirmation was returned.',
    );
  }

  const subtotal = items.reduce(
    (total, item) => total + item.size.price * item.quantity,
    0,
  );

  return {
    id: createdOrder.id,

    orderNumber: createdOrder.order_number,

    customerId: null,

    customer: {
      firstName: customer.firstName.trim(),
      lastName: customer.lastName.trim(),
      phone: customer.phone.trim(),
      email: customer.email.trim().toLowerCase(),
    },

    deliveryAddress: {
      address: deliveryAddress.address.trim(),
      city: deliveryAddress.city.trim(),
      notes: deliveryAddress.notes.trim(),
    },

    deliveryMethod,

    deliveryCost,

    paymentMethod: 'pay_on_delivery',

    paymentStatus: 'pending',

    items: items.map((item) => ({
      product: item.product,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.size.price,
      lineTotal: item.size.price * item.quantity,
    })),

    subtotal,

    total: subtotal + deliveryCost,

    status: 'pending',

    createdAt: new Date().toISOString(),

    guestAccessToken: createdOrder.guest_access_token,
  };
}

function extractCreatedOrder(
  data: CreateCustomerOrderResponse[] | CreateCustomerOrderResponse | null,
): CreateCustomerOrderResponse | null {
  if (!data) {
    return null;
  }

  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  return data;
}

function getProductNameSnapshot(item: CartItem): Record<string, string> {
  const translations = item.product.translations;

  if (!translations) {
    return {};
  }

  return translations.reduce<Record<string, string>>((result, translation) => {
    result[translation.locale] = translation.name;
    return result;
  }, {});
}
