import type { CartItem } from '@/components/cart/cart-provider';

import type {
  DeliveryMethod,
  Order,
  OrderAddress,
  OrderCustomer,
} from '@/types/order';

type CreateOrderInput = {
  customerId: string | null;
  customer: OrderCustomer;
  deliveryAddress: OrderAddress;
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
};

const generateOrderId = () => {
  return `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `PF-${timestamp}-${random}`;
};

export function createOrder({
  customerId,
  customer,
  deliveryAddress,
  items,
  deliveryMethod,
  deliveryCost,
}: CreateOrderInput): Order {
  const orderItems = items.map((item) => {
    const unitPrice = item.size.price;
    const lineTotal = unitPrice * item.quantity;

    return {
      product: item.product,
      size: item.size,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    };
  });

  const subtotal = orderItems.reduce(
    (total, item) => total + item.lineTotal,
    0,
  );

  const total = subtotal + deliveryCost;

  return {
    id: generateOrderId(),
    orderNumber: generateOrderNumber(),
    customerId,
    customer,
    deliveryAddress,
    deliveryMethod,
    deliveryCost,
    paymentMethod: 'pay_on_delivery',
    paymentStatus: 'pending',
    items: orderItems,
    subtotal,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}
