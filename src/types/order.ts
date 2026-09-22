import type { Product, ProductSize } from '@/types/product';

export type DeliveryMethod = 'standard' | 'express';

export type PaymentMethod = 'pay_on_delivery';

export type PaymentStatus = 'pending' | 'paid';

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
  customerId: string | null;
  customer: OrderCustomer;
  deliveryAddress: OrderAddress;
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

/*
 * =========================================================
 * CUSTOMER ORDER
 * =========================================================
 *
 * This is the persisted order representation returned
 * from the customer order service.
 */

/**
 * Checkout/order model.
 *
 * This represents the order data used by the checkout flow.
 * It is intentionally separate from CustomerOrder, which is the
 * database-backed read model returned by the customer order service.
 */

/**
 * Customer-facing order item read model.
 *
 * This represents the historical product information stored with
 * an order in the database.
 *
 * It deliberately does NOT contain `product: Product`.
 */
export type CustomerOrderItem = {
  id: string;

  productId: string;
  productSizeId: string;

  /**
   * Historical product name snapshot stored with the order.
   *
   * Example:
   * {
   *   en: "Sauvage",
   *   fr: "Sauvage"
   * }
   */
  productName: Record<string, string>;

  /**
   * Historical product slug stored with the order.
   */
  productSlug: string | null;

  /**
   * Historical product gender stored with the order.
   */
  productGender: Product['gender'] | null;

  /**
   * Historical product image URL stored with the order.
   */
  productImageUrl: string;

  sizeMl: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

/**
 * Customer information as persisted with an order.
 *
 * Email is nullable because older orders may have been created
 * before customer_email was added to the orders table.
 */
export type CustomerOrderCustomer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
};

/**
 * Database-backed customer order read model.
 *
 * This type intentionally does NOT extend Order.
 *
 * It represents the actual shape of the customer order returned
 * by the database/service layer, including lifecycle timestamps
 * and historical product snapshots.
 */
export type CustomerOrder = {
  id: string;
  orderNumber: string;
  customerId: string | null;

  customer: CustomerOrderCustomer;

  deliveryAddress: {
    address: string;
    city: string;
    notes: string;
  };

  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'pay_on_delivery';
  paymentStatus: 'pending' | 'paid';

  subtotal: number;
  deliveryCost: number;
  total: number;

  status: OrderStatus;

  createdAt: string;

  confirmedAt: string | null;
  processedAt: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  rejectedAt: string | null;
  cancelledAt: string | null;

  deliveryFeeConfirmed: boolean;

  rejectionNote: string | null;

  items: CustomerOrderItem[];
};

/* ============================================================
 * ADMIN ORDER TYPES
 * ============================================================
 */

/**
 * Admin-facing order item read model.
 *
 * This is deliberately separate from both:
 *
 * - OrderItem
 * - CustomerOrderItem
 *
 * It represents the information the admin application needs
 * when managing an order.
 */
export type AdminOrderItem = {
  id: string;

  productId: string | null;
  productSizeId: string | null;

  /**
   * Historical product information captured when the order
   * was created.
   */
  productName: Record<string, string> | null;
  productSlug: string | null;
  productGender: Product['gender'] | null;
  productImageUrl: string | null;

  sizeMl: number;

  quantity: number;
  unitPrice: number;
  subtotal: number;
};

/**
 * Customer information available to the admin.
 */
export type AdminOrderCustomer = {
  id: string | null;

  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
};

/**
 * Admin-facing database read model.
 *
 * This is the complete order representation used by the
 * admin order-management area.
 *
 * It intentionally does NOT extend:
 *
 * - Order
 * - CustomerOrder
 *
 * because it is a different database-backed read model.
 */
export type AdminOrder = {
  id: string;
  orderNumber: string;

  customer: AdminOrderCustomer;

  deliveryAddress: {
    address: string;
    city: string;
    notes: string;
  };

  deliveryMethod: 'standard' | 'express';

  paymentMethod: 'pay_on_delivery';
  paymentStatus: 'pending' | 'paid';

  subtotal: number;
  deliveryCost: number;
  deliveryFeeConfirmed: boolean;
  total: number;

  status: OrderStatus;

  createdAt: string;

  confirmedAt: string | null;
  processedAt: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  rejectedAt: string | null;
  cancelledAt: string | null;

  rejectionNote: string | null;

  items: AdminOrderItem[];
};

export type AdminOrderAuditAction =
  | 'status_changed'
  | 'payment_marked_paid'
  | 'delivery_fee_confirmed';

export type AdminOrderAuditLog = {
  id: string;
  orderId: string;
  actorUserId: string | null;
  action: AdminOrderAuditAction;
  previousStatus: OrderStatus | null;
  newStatus: OrderStatus | null;
  previousPaymentStatus: 'pending' | 'paid' | null;
  newPaymentStatus: 'pending' | 'paid' | null;
  previousDeliveryFee: number | null;
  newDeliveryFee: number | null;
  note: string | null;
  createdAt: string;
  actorName: string | null;
};
