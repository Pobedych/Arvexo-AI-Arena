import type { Metadata } from "next";
import { ErrorScene } from "@/components/ErrorScene";

export const metadata: Metadata = {
  title: "403 — не тот класс",
};

export default function ForbiddenPage() {
  return (
    <ErrorScene
      code="403"
      glyph="🔒"
      title="Классификатор доступа отнёс тебя не в тот класс"
      subtitle="Сюда пускают только с нужными правами — как на закрытый турнир по приглашениям. Если это ошибка, попробуй войти под другим аккаунтом Arvexo."
      primaryHref="/app/dashboard"
      primaryLabel="На дашборд"
      secondaryHref="/login"
      secondaryLabel="Войти заново"
    />
  );
}
