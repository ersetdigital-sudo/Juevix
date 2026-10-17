import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { getLastModified } from "@/lib/build-date";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = await getLastModified();

  return [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...services.map((service) => ({
      url: `${site.url}/${service.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    {
      url: `${site.url}/syarat-ketentuan`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${site.url}/kebijakan-privasi`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
