export type NotificationAudience = 'customer' | 'owner' | 'admin' | 'manager';

export type NotificationType =
  | 'new_order'
  | 'order_status_changed'
  | 'delivery_fee_confirmed';

export type NotificationTargetType = 'order' | 'admin_order';

export type Notification = {
  id: string;
  recipient_user_id: string;
  audience: NotificationAudience;
  type: NotificationType;
  title: string;
  message: string;
  target_type: NotificationTargetType;
  target_id: string | null;
  metadata: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};
