import { createClient } from '@/lib/supabase/client';
import type { Notification } from '@/types/notification';

export async function getClientNotifications(options?: {
  limit?: number;
  offset?: number;
}) {
  const supabase = createClient();

  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 100);
  const offset = Math.max(options?.offset ?? 0, 0);

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  return (data ?? []) as Notification[];
}

export async function getClientUnreadNotificationCount() {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('notifications')
    .select('id', {
      count: 'exact',
      head: true,
    })
    .eq('is_read', false);

  if (error) {
    throw new Error(
      `Failed to fetch unread notification count: ${error.message}`,
    );
  }

  return count ?? 0;
}
