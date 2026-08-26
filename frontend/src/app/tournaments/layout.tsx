import type { ReactNode } from "react";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({
  title: "Олимпиады и AI-турниры онлайн",
  description:
    "Актуальные и завершённые AI-турниры Arvexo Arena: даты, темы и формат соревнований доступны без регистрации.",
  path: "/tournaments",
});

export default function TournamentsLayout({ children }: { children: ReactNode }) {
  return children;
}
