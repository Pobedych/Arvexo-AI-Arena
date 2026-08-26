import { ImageResponse } from "next/og";

export const alt = "Arvexo Arena — олимпиады и AI-турниры";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f4ee",
          color: "#15171c",
          padding: "72px 80px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 34, fontWeight: 700 }}>
          <div
            style={{
              width: 58,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              background: "#15171c",
              color: "#74bd70",
              fontSize: 36,
            }}
          >
            A
          </div>
          Arvexo Arena
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ maxWidth: 980, fontSize: 72, lineHeight: 1.02, letterSpacing: "-3px", fontWeight: 700 }}>
            Подготовка к олимпиадам и AI-турнирам
          </div>
          <div style={{ fontSize: 28, color: "#5f636b" }}>Треки · практика · соревнования · подтверждённые результаты</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: "#3f8240" }}>
          arena.arvexo.ru <span style={{ color: "#15171c" }}>→</span>
        </div>
      </div>
    ),
    size,
  );
}
