import type { Product, ProductSize } from '@/types/product';

export type DeliveryMethod = 'standard' | 'express';

export type PaymentMethod = 'pay_on_delivery';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'out_for_delivery'
  | 'delivered'
  | 'rejected'
  | 'cancelled';

export type OrderCustomer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type OrderAddress = {
  address: string;
  city: string;
  notes: string;
};

export type OrderItem = {
  product: Product;
  size: ProductSize;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  orderNumber: string;

  /**
   * Supabase Auth user ID of the customer who placed the order.
   *
   * This is null for orders placed without an authenticated
   * customer account.
   */
  customerId: string | null;

  customer: OrderCustomer;
  deliveryAddress: OrderAddress;
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};
