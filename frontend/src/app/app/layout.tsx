import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata;

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
