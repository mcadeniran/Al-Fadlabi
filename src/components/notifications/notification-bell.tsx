"use client";

import {useMemo, useState} from "react";
import {Bell, CheckCheck, Clock3, PackageCheck, } from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import {Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger, } from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useNotifications} from "@/components/notifications/notification-provider";
import type {Notification} from "@/types/notification";

type NotificationBellProps = {
  audience: "customer" | "admin";
};

function NotificationIcon({
  type,
}: {
  type: Notification["type"];
}) {
  const iconProps = {
    size: 15,
    strokeWidth: 1.25,
  };

  switch (type) {
    case "new_order":
      return <PackageCheck {...iconProps} />;

    case "order_status_changed":
      return <Clock3 {...iconProps} />;

    case "delivery_fee_confirmed":
      return <CheckCheck {...iconProps} />;

    default:
      return <Bell {...iconProps} />;
  }
}

function getNotificationHref(
  notification: Notification,
  audience: NotificationBellProps["audience"],
) {
  if (!notification.target_id) {
    return null;
  }

  if (
    audience === "admin" &&
    notification.target_type === "admin_order"
  ) {
    return `/admin/orders/${notification.metadata.order_number}`;
  }

  if (
    audience === "customer" &&
    notification.target_type === "order"
  ) {
    // Customer order route will be confirmed when we wire this
    // into the storefront account pages.
    return `/account/orders/${notification.metadata.order_number}`;
  }

  return null;
}

function formatNotificationTime(
  date: string,
  locale: string,
) {
  return new Intl.DateTimeFormat(
    locale === "ar" ? "ar" : "en",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(date));
}

function NotificationItem({
  notification,
  audience,
  onRead,
  onNavigate,
}: {
  notification: Notification;
  audience: NotificationBellProps["audience"];
  onRead: (notificationId: string) => Promise<void>;
  onNavigate: () => void;
}) {
  const t = useTranslations("Notifications");
  const locale = useLocale();

  const href = getNotificationHref(notification, audience);
  // const Icon = getNotificationIcon(notification.type);

  const title = t(`${notification.type}.title`);

  const message =
    notification.type === "new_order"
      ? t("new_order.message", {
        orderNumber: String(
          notification.metadata.order_number ?? "",
        ),
      })
      : notification.type === "order_status_changed"
        ? t("order_status_changed.message", {
          orderNumber: String(
            notification.metadata.order_number ?? "",
          ),
          status: t(
            `statuses.${String(
              notification.metadata.new_status ?? "",
            )}`,
          ),
        })
        : t("delivery_fee_confirmed.message", {
          orderNumber: String(
            notification.metadata.order_number ?? "",
          ),
        });

  const content = (
    <span
      className={`group flex w-full gap-3 px-3 py-3 text-start transition-colors hover:bg-ink/3 ${!notification.is_read
        ? "bg-plum/[0.035]"
        : ""
        }`}
    >
      <span
        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${notification.is_read
          ? "bg-ink/5 text-ink/45"
          : "bg-plum/10 text-plum"
          }`}
      >
        {/* <Icon
          size={15}
          strokeWidth={1.25}
        /> */}
        <NotificationIcon type={notification.type} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span
            className={`text-sm leading-tight ${notification.is_read
              ? "font-medium text-ink/70"
              : "font-semibold text-ink"
              }`}
          >
            {title}
          </span>

          {!notification.is_read && (
            <span
              aria-label={t("unread")}
              className="mt-1 size-1.5 shrink-0 rounded-full bg-plum"
            />
          )}
        </span>

        <span className="mt-1 block text-xs leading-relaxed text-ink/55">
          {message}
        </span>

        <span className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-ink/35">
          <Clock3
            size={11}
            strokeWidth={1.25}
          />

          {formatNotificationTime(
            notification.created_at,
            locale,
          )}
        </span>
      </span>
    </span>
  );

  const handleClick = () => {
    if (!notification.is_read) {
      void onRead(notification.id);
    }

    onNavigate();
  };

  if (!href) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="block w-full"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="block"
    >
      {content}
    </Link>
  );
}

export function NotificationBell({
  audience,
}: NotificationBellProps) {
  const t = useTranslations("Notifications");

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((notification) =>
        audience === "admin"
          ? notification.audience === "owner" ||
          notification.audience === "admin" ||
          notification.audience === "manager"
          : notification.audience === "customer",
      ),
    [notifications, audience],
  );

  const handleNotificationRead = async (
    notificationId: string,
  ) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error,
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error,
      );
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        aria-label={t("open")}
        className="relative flex size-9 items-center justify-center rounded-full transition-colors hover:bg-ink/5 hover:text-plum"
      >
        <Bell
          size={20}
          strokeWidth={1.25}
        />

        {unreadCount > 0 && (
          <span
            aria-label={t("unreadCount", {
              count: unreadCount,
            })}
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-plum px-1 text-[8px] font-semibold leading-none text-white"
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align={audience === "admin" ? "end" : "center"}
        sideOffset={10}
        className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-ink/8 bg-snow p-0 text-ink shadow-xl"
      >
        <PopoverHeader className="border-b border-ink/8 px-4 py-3.5">
          <div className="flex items-center justify-between gap-4">
            <PopoverTitle className="font-heading text-xl font-medium tracking-tight">
              {t("title")}
            </PopoverTitle>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void handleMarkAllAsRead()}
                className="text-[9px] font-medium uppercase tracking-[0.14em] text-plum transition-opacity hover:opacity-65"
              >
                {t("markAllAsRead")}
              </button>
            )}
          </div>

          {unreadCount > 0 && (
            <p className="mt-1 text-xs text-ink/45">
              {t("unreadSummary", {
                count: unreadCount,
              })}
            </p>
          )}
        </PopoverHeader>

        {isLoading ? (
          <div className="flex min-h-44 items-center justify-center px-6 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-ink/35">
              {t("loading")}
            </p>
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
            <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-ink/5 text-ink/35">
              <Bell
                size={17}
                strokeWidth={1.25}
              />
            </span>

            <p className="text-sm font-medium text-ink/65">
              {t("empty.title")}
            </p>

            <p className="mt-1 text-xs text-ink/40">
              {t("empty.description")}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[min(28rem,calc(100vh-10rem))]">
            <div className="divide-y divide-ink/6">
              {visibleNotifications.map(
                (notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    audience={audience}
                    onRead={handleNotificationRead}
                    onNavigate={() => setOpen(false)}
                  />
                ),
              )}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}