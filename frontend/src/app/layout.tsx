import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arvexo Olympiad Arena",
  description: "Учись. Соревнуйся. Докажи, что умеешь.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
