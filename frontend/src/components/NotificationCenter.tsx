"use client";

import { BellSimple, BookOpen, CheckCircle, FireSimple, Trophy } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { api, type ArenaNotification, type NotificationList, type PushConfig } from "@/lib/api";
import { subscribeToStreakPush, supportsWebPush, unsubscribeFromStreakPush } from "@/lib/push";

function notificationTime(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function NotificationIcon({ kind }: { kind: ArenaNotification["kind"] }) {
  if (kind === "tournament") return <Trophy size={17} weight="regular" aria-hidden="true" />;
  if (kind === "lesson") return <BookOpen size={17} weight="regular" aria-hidden="true" />;
  return <FireSimple size={17} weight="regular" aria-hidden="true" />;
}

export function NotificationCenter() {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [notifications, setNotifications] = useState<ArenaNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pushConfig, setPushConfig] = useState<PushConfig | null>(null);
  const [pushBusy, setPushBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [list, config] = await Promise.all([
        api<NotificationList>("/notifications?limit=12"),
        api<PushConfig>("/notifications/push/config"),
      ]);
      setNotifications(list.items);
      setUnreadCount(list.unread_count);
      setPushConfig(config);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось загрузить уведомления");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(refresh, 0);
    const interval = window.setInterval(refresh, 60_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [pathname, refresh]);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (detailsRef.current?.open && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.open = false;
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  const markRead = async (notification: ArenaNotification) => {
    if (notification.read_at) return;
    const readAt = new Date().toISOString();
    setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, read_at: readAt } : item));
    setUnreadCount((count) => Math.max(0, count - 1));
    try {
      await api(`/notifications/${notification.id}/read`, { method: "POST" });
    } catch {
      void refresh();
    }
  };

  const markAllRead = async () => {
    const readAt = new Date().toISOString();
    setNotifications((items) => items.map((item) => ({ ...item, read_at: item.read_at ?? readAt })));
    setUnreadCount(0);
    try {
      await api("/notifications/read-all", { method: "POST" });
    } catch {
      void refresh();
    }
  };

  const togglePush = async () => {
    if (!pushConfig?.enabled || !pushConfig.public_key || pushBusy) return;
    setPushBusy(true);
    setError("");
    try {
      const nextConfig = pushConfig.subscribed
        ? await unsubscribeFromStreakPush()
        : await subscribeToStreakPush(pushConfig.public_key);
      if (nextConfig) setPushConfig(nextConfig);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось изменить push-настройку");
    } finally {
      setPushBusy(false);
    }
  };

  return (
    <details ref={detailsRef} name="header-progress" className="group relative block">
      <summary
        aria-label={unreadCount > 0 ? `Уведомления: ${unreadCount} непрочитанных` : "Уведомления"}
        onClick={() => void refresh()}
        className="relative grid h-[34px] w-[34px] cursor-pointer list-none place-items-center rounded-full text-[#4d5158] transition-colors hover:bg-[#f1f4ef] hover:text-[#2f742d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] active:scale-[.97] [&::-webkit-details-marker]:hidden"
      >
        <BellSimple size={19} weight={unreadCount > 0 ? "fill" : "regular"} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-h-[16px] min-w-[16px] place-items-center rounded-full bg-[#52a24f] px-1 text-[9px] font-semibold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </summary>

      <div className="fixed left-3 right-3 top-[62px] z-30 overflow-hidden rounded-[16px] border border-[rgba(21,23,28,.1)] bg-white text-[#15171c] shadow-[0_20px_52px_-28px_rgba(21,23,28,.38)] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+10px)] sm:w-[370px]">
        <div className="flex min-h-14 items-center justify-between gap-4 border-b border-[rgba(21,23,28,.08)] px-4">
          <strong className="text-[14px] font-semibold">Уведомления</strong>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="text-[11px] font-medium text-[#2f742d] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
            >
              Прочитать все
            </button>
          )}
        </div>

        <div className="max-h-[390px] overflow-y-auto p-2">
          {loading && notifications.length === 0 && (
            <div className="space-y-2 p-2" aria-label="Загрузка уведомлений">
              {[0, 1, 2].map((item) => <div key={item} className="h-[74px] animate-pulse rounded-[12px] bg-[#f2f2ee]" />)}
            </div>
          )}
          {!loading && notifications.length === 0 && !error && (
            <div className="px-5 py-10 text-center">
              <CheckCircle size={24} weight="regular" className="mx-auto text-[#52a24f]" aria-hidden="true" />
              <strong className="mt-3 block text-[13px] font-semibold">Пока всё просмотрено</strong>
              <p className="mt-1 text-[11.5px] leading-relaxed text-[#6b6f76]">Здесь появятся новые уроки, турниры и напоминания.</p>
            </div>
          )}
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.href}
              onClick={() => void markRead(notification)}
              className={`mb-1 grid grid-cols-[32px_1fr] gap-2.5 rounded-[12px] px-3 py-3 transition-colors last:mb-0 hover:bg-[#f3f5f1] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#16a34a] ${notification.read_at ? "text-[#5f636b]" : "bg-[#eef5ec] text-[#15171c]"}`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-full ${notification.read_at ? "bg-[#f1f1ed] text-[#6b6f76]" : "bg-white text-[#2f742d]"}`}>
                <NotificationIcon kind={notification.kind} />
              </span>
              <span className="min-w-0">
                <span className="flex items-start justify-between gap-3">
                  <strong className="text-[12px] font-semibold leading-snug">{notification.title}</strong>
                  <time className="shrink-0 text-[9.5px] text-[#858990]" dateTime={notification.created_at}>{notificationTime(notification.created_at)}</time>
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-[#6b6f76]">{notification.body}</span>
              </span>
            </Link>
          ))}
        </div>

        {pushConfig?.enabled && pushConfig.public_key && supportsWebPush() && (
          <div className="border-t border-[rgba(21,23,28,.08)] bg-[#fafaf7] px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <strong className="block text-[11.5px] font-semibold">Push для огонька</strong>
                <span className="mt-0.5 block text-[10px] text-[#6b6f76]">Напомним вечером, если серия под угрозой.</span>
              </div>
              <button
                type="button"
                disabled={pushBusy}
                onClick={() => void togglePush()}
                className={`shrink-0 rounded-full px-3 py-2 text-[10.5px] font-semibold transition-transform active:scale-[.98] disabled:cursor-wait disabled:opacity-60 ${pushConfig.subscribed ? "bg-[#e6f1e3] text-[#2f742d]" : "bg-[#15171c] text-white"}`}
              >
                {pushBusy ? "Подождите" : pushConfig.subscribed ? "Включены" : "Включить"}
              </button>
            </div>
          </div>
        )}
        {error && <p className="border-t border-[#ead4d1] bg-[#fff8f7] px-4 py-2.5 text-[10.5px] text-[#9f2d23]">{error}</p>}
      </div>
    </details>
  );
}
