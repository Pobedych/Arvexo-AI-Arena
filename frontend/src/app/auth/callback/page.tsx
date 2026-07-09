"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function CallbackBridge() {
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    if (code && state) {
      window.location.replace(`/api/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`);
    }
  }, [params]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
      <div>
        <p className="text-[13px] text-[#6b6f76] mb-4">Завершаем вход через Arvexo Account…</p>
        <Link
          href="/app/dashboard"
          className="inline-flex items-center h-11 px-5 rounded-full bg-[#15171c] text-white font-bold text-[13.5px] hover:opacity-85 transition-opacity"
        >
          Продолжить в Arena →
        </Link>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense>
      <CallbackBridge />
    </Suspense>
  );
}
