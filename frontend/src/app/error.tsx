"use client";

import { useEffect } from "react";
import { ErrorScene } from "@/components/ErrorScene";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorScene
      code="500"
      glyph="💥"
      title="У backend случился приступ переобучения"
      subtitle="Что-то сломалось на нашей стороне, а не в твоём ответе. Мы уже это логируем — попробуй ещё раз через пару секунд."
      primaryHref="/app/dashboard"
      primaryLabel="На дашборд"
      extra={
        <button
          onClick={reset}
          className="inline-flex items-center h-12 px-6 rounded-full border border-[rgba(21,23,28,.14)] font-bold text-[14px] hover:bg-white transition-colors mb-3"
        >
          Попробовать снова
        </button>
      }
    />
  );
}
