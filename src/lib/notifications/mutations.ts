import { createClient } from '@/lib/supabase/client';

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('mark_notification_read', {
    p_notification_id: notificationId,
  });

  if (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }

  return data;
}

export async function markAllNotificationsAsRead() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('mark_all_notifications_read');

  if (error) {
    throw new Error(
      `Failed to mark all notifications as read: ${error.message}`,
    );
  }

  return data ?? 0;
}
