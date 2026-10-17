import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { getService } from "@/data/services";
import { buildPageMetadata } from "@/lib/metadata";

const service = getService("pulsa");

export const metadata: Metadata = buildPageMetadata({
  title: service.meta.title,
  description: service.meta.description,
  path: `/${service.slug}`,
});

export default function PulsaPage() {
  return <ServicePage service={service} />;
}
