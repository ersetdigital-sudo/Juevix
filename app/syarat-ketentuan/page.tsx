import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legalDocuments } from "@/data/legal";
import { buildPageMetadata } from "@/lib/metadata";

const document = legalDocuments.terms;

export const metadata: Metadata = buildPageMetadata({
  title: document.title,
  description: document.description,
  path: `/${document.slug}`,
  type: "article",
});

export default function SyaratKetentuanPage() {
  return <LegalPage document={document} />;
}
