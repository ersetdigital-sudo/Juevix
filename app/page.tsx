import Link from "next/link";
import { CheckOrderForm } from "@/components/check-order-form";
import { Countdown } from "@/components/countdown";
import { FaqAccordion } from "@/components/faq-accordion";
import { FaqJsonLd } from "@/components/json-ld";
import { LiveFeed } from "@/components/live-feed";
import { Marquee } from "@/components/marquee";
import { ProductExplorer } from "@/components/product-explorer";
import { buildHomeProducts } from "@/lib/commerce";
import { getCatalog } from "@/lib/db/server";
import type { ProductLinks } from "@/lib/commerce";
import { Reveal } from "@/components/reveal";
import { orderSteps, testimonials } from "@/data/content";
import { products as staticProducts } from "@/data/products";
import { site } from "@/lib/site";

export default async function HomePage() {
  const catalog = await getCatalog();
  const home = catalog.data ? buildHomeProducts(catalog.data) : null;
  const homeProducts = home?.products ?? staticProducts;
  const homeLinks: ProductLinks = home?.links ?? {
    brandSlug: catalog.data?.brand.slug ?? "",
    methodId: "",
    waCs: catalog.data?.brand.wa_cs ?? null,
    options: {},
  };
  const brandSlug = catalog.data?.brand.slug ?? "";

  return (
    <main id="main" className="flex-1">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div
          className="glow absolute -right-40 -top-40 h-[600px] w-[600px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl gap-6 px-5 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[.2em] text-brand">
              Pembayaran Online Serba Ada
            </p>
            <h1 className="hd-tight text-5xl font-extrabold md:text-7xl">
              Semua tagihan,
              <br />
              <span className="text-brand">beres dalam</span> satu tempat.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Token PLN, pulsa, paket data, BPJS, PDAM, internet, sampai cicilan.
              Proses otomatis dalam hitungan detik, buka 24 jam, admin paling
              hemat.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#produk" className="btn">
                Bayar Tagihan →
              </Link>
              <Link href="/#cek" className="ghost">
                Cek Pesanan
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
              {site.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl font-extrabold">
                    {stat.value}
                  </dd>
                  <dd className="text-sm text-muted">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-5">
            <div className="panel col-span-2 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Transaksi terbaru</span>
                <span className="flex items-center gap-2 text-xs text-green-400">
                  <span
                    className="h-2 w-2 animate-pulse rounded-full bg-green-400"
                    aria-hidden="true"
                  />
                  Live
                </span>
              </div>
              <LiveFeed />
            </div>

            <div className="rounded-[20px] bg-brand p-6 text-white">
              <p className="text-sm font-bold">Cashback</p>
              <p className="font-display mt-2 text-4xl font-extrabold">
                {site.promo.cashbackValue}
              </p>
              <p className="mt-1 text-sm">Kode: {site.promo.cashbackCode}</p>
            </div>

            <div className="panel p-6">
              <p className="text-sm text-muted">Pembayaran</p>
              <p className="font-display mt-2 text-2xl font-extrabold">
                QRIS, VA &amp; E-Wallet
              </p>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* FLASH SALE */}
      <section id="flash" className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-20">
        <Reveal>
          <div className="panel flex flex-col gap-6 overflow-hidden p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="hd-tight text-3xl font-extrabold md:text-4xl">
                {site.promo.title}
              </h2>
              <p className="mt-2 text-muted">{site.promo.description}</p>
            </div>
            <Countdown />
          </div>
        </Reveal>
      </section>

      {/* PRODUK */}
      <section id="produk" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20">
        <ProductExplorer products={homeProducts} links={homeLinks} />
      </section>

      {/* CARA ORDER */}
      <section id="cara" className="scroll-mt-24 border-y border-line bg-panel">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="hd-tight max-w-xl text-4xl font-extrabold">
            Cuma 4 langkah, tagihan langsung lunas.
          </h2>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
            {orderSteps.map((item, index) => (
              <li key={item.step} className="bg-bg p-7">
                <Reveal delay={index * 0.08}>
                  <p className="font-display text-5xl font-extrabold text-brand">
                    {item.step}
                  </p>
                  <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CEK PESANAN + TESTIMONI */}
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 lg:grid-cols-2">
        <div id="cek" className="panel min-w-0 scroll-mt-24 p-6 sm:p-8">
          <h2 className="hd-tight text-3xl font-extrabold">
            Cek status pesanan
          </h2>
          <p className="mt-2 text-muted">
            Masukkan nomor invoice dari email / WhatsApp.
          </p>
          <CheckOrderForm brandSlug={brandSlug} />
        </div>

        <div className="grid gap-4">
          {testimonials.map((item) => (
            <figure key={item.author} className="panel p-6">
              <p className="text-brand" aria-label={`${item.rating} dari 5 bintang`}>
                {"★".repeat(item.rating)}
              </p>
              <blockquote className="mt-3">“{item.quote}”</blockquote>
              <figcaption className="mt-3 text-sm text-muted">
                {item.author}, {item.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 pb-20">
        <h2 className="hd-tight text-center text-4xl font-extrabold">
          Pertanyaan umum
        </h2>
        <FaqAccordion />
        <FaqJsonLd />
      </section>
    </main>
  );
}
