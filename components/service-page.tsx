import Link from "next/link";
import { services, type Service } from "@/data/services";
import { ServiceJsonLd } from "./json-ld";
import { ServiceOrderForm } from "./service-order-form";
import type { PageLinks } from "@/lib/commerce";
import { SpriteIcon } from "./sprite-icon";
import { cn } from "@/lib/cn";

interface ServicePageProps {
  service: Service;
  links: PageLinks;
}

export function ServicePage({ service, links }: ServicePageProps) {
  return (
    <main id="main" className="flex-1">
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div
          className="glow absolute -right-40 -top-40 h-[500px] w-[500px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">
                {service.title}
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex items-center gap-5">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl border border-line bg-panel-2">
              <div className="w-[72%] motion-safe:animate-float">
                <SpriteIcon index={service.sprite} priority />
              </div>
            </div>
            <h1 className="hd-tight text-4xl font-extrabold md:text-5xl">
              {service.title}
            </h1>
          </div>

          <p className="mt-4 max-w-2xl text-muted">{service.description}</p>

          <div className="mt-6 flex flex-wrap gap-2 pb-1">
            {services.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                aria-current={item.slug === service.slug ? "page" : undefined}
                className={cn("tab", item.slug === service.slug && "is-active")}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ServiceOrderForm service={service} links={links} />

      <ServiceJsonLd slug={service.slug} />
    </main>
  );
}
