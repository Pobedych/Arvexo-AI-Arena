import type { ReactNode } from "react";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
