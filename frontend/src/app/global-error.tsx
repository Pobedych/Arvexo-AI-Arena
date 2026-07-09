"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f4ee",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              border: "1px solid rgba(21,23,28,.08)",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "#6b6f76",
              marginBottom: 28,
            }}
          >
            🧯 Arvexo Arena
          </div>
          <strong style={{ fontSize: 96, fontWeight: 700, lineHeight: 1, display: "block", marginBottom: 8, color: "#15171c" }}>
            500
          </strong>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.02em", marginBottom: 12 }}>
            Arena споткнулась о собственные веса
          </h1>
          <p style={{ fontSize: 14, color: "#6b6f76", lineHeight: 1.6, marginBottom: 28 }}>
            Экран сломался целиком, а не только один блок на странице. Обычно помогает перезапуск — как с любой нейросетью.
          </p>
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 48,
              padding: "0 24px",
              borderRadius: 999,
              background: "#16a34a",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
            }}
          >
            Перезапустить
          </button>
        </div>
      </body>
    </html>
  );
}
