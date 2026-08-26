import type { ReactNode } from "react";
import { publicMetadata } from "@/lib/seo";

export const metadata = publicMetadata({
  title: "AI-треки и машинное обучение",
  description:
    "Открытые образовательные треки Arvexo Arena: уроки, примеры и практические задания по искусственному интеллекту и машинному обучению.",
  path: "/tracks",
});

export default function TracksLayout({ children }: { children: ReactNode }) {
  return children;
}
