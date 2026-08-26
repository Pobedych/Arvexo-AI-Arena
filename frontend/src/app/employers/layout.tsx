import type { ReactNode } from "react";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({
  title: "Кандидаты с подтверждёнными AI-навыками",
  description:
    "Arvexo Arena для работодателей: находите кандидатов с результатами реальных AI-турниров и автоматически проверенных заданий.",
  path: "/employers",
});

export default function EmployersLayout({ children }: { children: ReactNode }) {
  return children;
}
