'use client';

import { useEffect } from 'react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { Notification } from '@/types/notification';

type UseNotificationsRealtimeProps = {
  onInsert?: (notification: Notification) => void;
  onUpdate?: (notification: Notification) => void;
};

export function useNotificationsRealtime({
  onInsert,
  onUpdate,
}: UseNotificationsRealtimeProps) {
  useEffect(() => {
    const supabase = createClient();

    let channel: ReturnType<typeof supabase.channel> | null = null;

    let cancelled = false;

    async function subscribe() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled || !user) {
        return;
      }

      channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_user_id=eq.${user.id}`,
          },
          (payload: RealtimePostgresChangesPayload<Notification>) => {
            if (payload.eventType !== 'INSERT') {
              return;
            }

            onInsert?.(payload.new as Notification);
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_user_id=eq.${user.id}`,
          },
          (payload: RealtimePostgresChangesPayload<Notification>) => {
            if (payload.eventType !== 'UPDATE') {
              return;
            }

            onUpdate?.(payload.new as Notification);
          },
        );

      if (cancelled) {
        await supabase.removeChannel(channel);
        channel = null;
        return;
      }

      await channel.subscribe();
    }

    void subscribe();

    return () => {
      cancelled = true;

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [onInsert, onUpdate]);
}
