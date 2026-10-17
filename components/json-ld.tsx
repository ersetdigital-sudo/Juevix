import { faqs } from "@/data/faq";
import { services } from "@/data/services";
import { site, siteUrl } from "@/lib/site";
import { ADMIN_FEE } from "@/lib/estimate";

type Json = Record<string, unknown>;

function JsonLd({ data }: { data: Json }) {
  // Escape "<" supaya isi data tidak bisa menutup tag script lebih awal.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

function contactPoints() {
  const points: Json[] = [];

  if (site.whatsapp) {
    points.push({
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${site.whatsapp.replace(/\D/g, "")}`,
      availableLanguage: ["id"],
    });
  }

  if (site.email) {
    points.push({
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.email,
      availableLanguage: ["id"],
    });
  }

  return points;
}

export function OrganizationJsonLd() {
  const contacts = contactPoints();

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        description: site.description,
        logo: {
          "@type": "ImageObject",
          url: siteUrl("/images/brand/juevix-logo.png"),
        },
        areaServed: { "@type": "Country", name: "Indonesia" },
        slogan: site.tagline,
        ...(contacts.length > 0 ? { contactPoint: contacts } : {}),
        knowsAbout: services.map((service) => service.title),
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        inLanguage: "id-ID",
        publisher: { "@id": `${site.url}/#organization` },
      }}
    />
  );
}

export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }}
    />
  );
}

export function ServiceJsonLd({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug);
  if (!service) return null;

  const pageUrl = siteUrl(`/${service.slug}`);
  const prices = service.groups
    .flatMap((group) => group.options.map((option) => option.price))
    .filter((price) => price > 0);

  const lowPrice = prices.length > 0 ? Math.min(...prices) : ADMIN_FEE;
  const highPrice = prices.length > 0 ? Math.max(...prices) : ADMIN_FEE;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
            {
              "@type": "ListItem",
              position: 2,
              name: service.title,
              item: pageUrl,
            },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.meta.description,
          url: pageUrl,
          serviceType: service.title,
          areaServed: { "@type": "Country", name: "Indonesia" },
          provider: { "@id": `${site.url}/#organization` },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "IDR",
            lowPrice,
            highPrice,
            offerCount: Math.max(prices.length, 1),
          },
        }}
      />
    </>
  );
}
