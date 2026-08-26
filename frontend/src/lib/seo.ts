import type { Metadata } from "next";

export const SITE_URL = "https://arena.arvexo.ru";
export const SITE_NAME = "Arvexo Arena";

type PublicMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function publicMetadata({ title, description, path }: PublicMetadataInput): Metadata {
  const canonical = path === "/" ? "/" : path.replace(/\/$/, "");

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "ru-RU": canonical,
      },
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/opengraph-image", alt: "Arvexo Arena — олимпиады и AI-турниры" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const privateMetadata: Metadata = {
  alternates: {
    canonical: null,
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};
