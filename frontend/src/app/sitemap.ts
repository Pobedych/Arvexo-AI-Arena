import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-26");

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tracks`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/tournaments`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/employers`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}
