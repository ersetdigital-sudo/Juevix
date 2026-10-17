import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "@/data/nav";
import { getCurrentYear } from "@/lib/current-year";
import { site } from "@/lib/site";

export async function SiteFooter() {
  const year = await getCurrentYear();
  const whatsappHref = site.whatsapp
    ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand p-8 text-white sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="hd-tight text-3xl font-extrabold md:text-4xl">
              Bayar tagihan sekarang, tanpa antre.
            </h2>
            <p className="mt-2 text-sm text-white/90">
              Buka 24 jam, proses otomatis dalam hitungan detik.
            </p>
          </div>
          <Link
            href="/#produk"
            className="rounded-xl bg-black px-6 py-4 font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Mulai Bayar →
          </Link>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-6 text-sm text-muted md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/images/brand/juevix-logo.png"
              alt="Juevix"
              width={1026}
              height={324}
              className="h-6 w-auto"
            />
            <span>© {year} Juevix. Semua hak dilindungi.</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                WhatsApp CS
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                {site.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
