"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const reasonCopy: Record<string, { glyph: string; title: string }> = {
  expired: {
    glyph: "⏳",
    title: "Сессия устала и заснула — как модель без ранней остановки. Войди ещё раз.",
  },
  auth_failed: {
    glyph: "🤖",
    title: "Arvexo Account не подтвердил вход. Попробуй ещё раз — обычно это временный сбой.",
  },
};

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const reason = params.get("reason");
  const notice = reason ? reasonCopy[reason] : null;
  const [checkingSession, setCheckingSession] = useState(!reason);

  useEffect(() => {
    if (reason) return;
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => {
        if (cancelled) return;
        if (response.ok) {
          router.replace("/app/dashboard");
        } else {
          setCheckingSession(false);
        }
      })
      .catch(() => {
        if (!cancelled) setCheckingSession(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reason, router]);

  if (checkingSession) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[420px] text-center">
        <span className="inline-grid w-11 h-11 rounded-xl bg-[#15171c] place-items-center text-white font-extrabold text-[17px] font-[family-name:var(--font-display)] mb-6">
          A
        </span>
        {notice && (
          <div className="rounded-2xl bg-[#f6f4ee] border border-[rgba(21,23,28,.08)] py-3.5 px-4 mb-6 text-left flex gap-2.5 items-start">
            <span className="text-lg leading-none">{notice.glyph}</span>
            <p className="text-[12.5px] text-[#6b6f76] leading-relaxed">{notice.title}</p>
          </div>
        )}
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(24px,3vw,32px)] font-semibold tracking-[-.02em] mb-3">
          Вход в Arvexo Arena
        </h1>
        <p className="text-[14.5px] text-[#6b6f76] leading-relaxed mb-8">
          Arena использует единый аккаунт экосистемы Arvexo. Пароли и регистрация — на стороне Arvexo Account.
        </p>
        <Link
          href="/api/auth/start?return_to=/onboarding"
          className="inline-flex items-center justify-center w-full h-12.5 px-6 rounded-[10px] bg-[#16a34a] text-white font-bold text-[14.5px] hover:opacity-90 transition-opacity"
        >
          Продолжить с Arvexo Account
        </Link>
        <Link href="/" className="block mt-6 text-[13px] text-[#6b6f76] hover:text-[#15171c] transition-colors">
          ← На главную
        </Link>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
