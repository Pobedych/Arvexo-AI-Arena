import type { Metadata } from "next";
import { ErrorScene } from "@/components/ErrorScene";

export const metadata: Metadata = {
  title: "404 — модель не нашла закономерность",
};

export default function NotFound() {
  return (
    <ErrorScene
      code="404"
      glyph="🔍"
      title="Модель прогнала эту страницу через все слои — совпадений не нашлось"
      subtitle="Похоже, такого URL нет в обучающей выборке Arena. Либо ссылка устарела, либо страница ещё не опубликована."
      primaryHref="/"
      primaryLabel="На главную"
      secondaryHref="/app/dashboard"
      secondaryLabel="Открыть кабинет"
    />
  );
}
