import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { DataUnavailable } from "@/components/data-unavailable";
import { buildServicePage } from "@/lib/commerce";
import { getCatalog } from "@/lib/db/server";
import { getService } from "@/data/services";
import { buildPageMetadata } from "@/lib/metadata";

const service = getService("pdam");

export const metadata: Metadata = buildPageMetadata({
  title: service.meta.title,
  description: service.meta.description,
  path: `/${service.slug}`,
});

export default async function PdamPage() {
  const catalog = await getCatalog();
  if (!catalog.data) return <DataUnavailable message={catalog.error} />;
  const page = buildServicePage("pdam", catalog.data);
  if (!page) return <DataUnavailable message="Layanan belum tersedia." />;
  return <ServicePage service={page.service} links={page.links} />;
}
