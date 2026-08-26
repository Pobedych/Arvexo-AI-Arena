import type { Metadata } from "next";
import { publicMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...publicMetadata({
    title: "Arvexo Arena — олимпиады и AI-турниры",
    description:
      "Образовательная платформа Arvexo для подготовки к олимпиадам и AI-турнирам: учебные треки, практические задачи, соревнования и подтверждённые результаты.",
    path: "/",
  }),
  title: {
    default: "Arvexo Arena — олимпиады и AI-турниры",
    template: "%s | Arvexo Arena",
  },
  applicationName: SITE_NAME,
  keywords: [
    "Arvexo Arena",
    "олимпиады по искусственному интеллекту",
    "AI-турниры",
    "машинное обучение",
    "подготовка к олимпиадам",
    "задачи по AI",
  ],
  authors: [{ name: "Arvexo", url: "https://arvexo.ru" }],
  creator: "Arvexo",
  publisher: "Arvexo",
  category: "education",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Arvexo",
      url: "https://arvexo.ru",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "ru-RU",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#application`,
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      inLanguage: "ru-RU",
      description:
        "Платформа для подготовки к олимпиадам и AI-турнирам с учебными треками, практикой и подтверждёнными результатами.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "RUB",
      },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
