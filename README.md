# Juevix — PPOB Landing & Order Flow

Konversi situs statis menjadi aplikasi **Next.js App Router + TypeScript + Tailwind CSS** dengan
identitas merek **Juevix** (dark `#0b0b0f` + oranye `#FF7A00`).
Tampilan, warna, dan konten asli dipertahankan; struktur diubah menjadi komponen & data yang bisa dipakai ulang.

## Menjalankan

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build produksi (semua halaman statis)
npm start       # jalankan hasil build
npm run lint    # ESLint
```

## Versi

| Paket | Versi |
| --- | --- |
| Next.js | 16.4.2 (App Router, Turbopack) |
| React / React DOM | 19.3.0 |
| TypeScript | 5 (strict) |
| Tailwind CSS | 4 (`@tailwindcss/turbopack`, tanpa `postcss.config`) |
| motion (framer-motion) | 14.3.0 |
| ESLint | 9 + `eslint-config-next` |

## Struktur

```
app/
  layout.tsx              font lokal (next/font/local), metadata global, header/footer, JSON-LD
  page.tsx                homepage (hero, marquee, flash sale, produk, cara, cek tagihan, FAQ)
  pln|pulsa|paket-data|   5 halaman layanan -> merender komponen ServicePage bersama
   bpjs|pdam/page.tsx
  bayar/page.tsx          alur pembayaran + invoice/VA (noindex)
  syarat-ketentuan/       halaman tambahan (tidak ada di HTML asli)
  kebijakan-privasi/
  not-found.tsx           404 bermerek
  sitemap.ts robots.ts    sitemap.xml & robots.txt
  icon.svg
  globals.css             token @theme Tailwind v4 + util (.btn/.panel/.tab/...)
  fonts/                  Inter & Plus Jakarta Sans (hanya bobot yang dipakai)

components/               site-header, site-footer, product-explorer, service-page,
                          service-order-form, payment-flow, faq-accordion, reveal,
                          marquee, live-feed, countdown, check-order-form,
                          sprite-icon, json-ld, legal-page

data/                     services, products, payment-methods, faq, nav, content, legal
lib/                      site (konfigurasi terpusat), metadata, operators, estimate,
                          format, cn, current-year, build-date

public/images/brand/      juevix-logo.png (wordmark), og-image.png (1200x630), sprite-services.png
public/images/operators/  telkomsel, indosat, xl, axis, smartfren

legacy-html/              HTML + gambar + font ASLI (referensi, tidak dipakai build)
```

### Menambah produk / layanan
Cukup ubah file di `data/`:
- `data/products.ts` — kategori di homepage (indeks sprite, aksen, HOT, opsi modal).
- `data/services.ts` — opsi & catatan untuk halaman PLN/pulsa/paket data/BPJS/PDAM.
- `data/payment-methods.ts`, `data/faq.ts`, `data/nav.ts`.

Tidak perlu menyentuh komponen.

## SEO / GEO

- Metadata lengkap tiap halaman lewat `lib/metadata.ts` (`buildPageMetadata`): title, description,
  canonical, Open Graph, Twitter `summary_large_image`.
- JSON-LD: Organization, WebSite, Service, AggregateOffer, BreadcrumbList.
- `app/sitemap.ts` (8 URL) dan `app/robots.ts` (aturan eksplisit untuk GPTBot, OAI-SearchBot,
  PerplexityBot, ClaudeBot, Google-Extended, dll; `/bayar` di-disallow & `noindex`).
- Gambar lewat `next/image`; font lewat `next/font/local` (tanpa `<link>` manual).

## Perlu diisi manual sebelum produksi

1. **`NEXT_PUBLIC_SITE_URL`** — domain final (default `https://juevix.id`). Dipakai untuk canonical, OG, sitemap, robots.
2. **`NEXT_PUBLIC_WHATSAPP`** — nomor CS format `62812xxxxxxx`. Selama kosong, tombol WhatsApp tidak dirender.
3. **Email CS** — `NEXT_PUBLIC_EMAIL`. Sama, tidak dirender bila kosong.
4. **Alur pembayaran** — `components/payment-flow.tsx` masih simulasi (VA/QRIS dibuat lokal). Sambungkan ke PPOB/biller API asli.
5. **Estimasi tagihan** — `lib/estimate.ts` memakai tarif contoh untuk PLN pascabayar & PDAM.
6. **Teks legal** — `data/legal.ts` (syarat & kebijakan privasi) adalah draf, minta review sebelum publikasi.
7. **Aset merek** — `public/images/brand/juevix-logo.png` (wordmark) dan `og-image.png` dibuat dari mark
   squircle gradien + "J" dan bisa diganti aset resmi. Mark di `app/icon.svg` dipakai sebagai favicon.

## Identitas merek

- Mark & favicon: `app/icon.svg`
- Wordmark: `public/images/brand/juevix-logo.png` (rasio 3.17, dipakai lewat `next/image` di header/footer)
- OG/Twitter: `public/images/brand/og-image.png`
- Warna: aksen `#FF7A00`, latar `#0b0b0f`, panel `#14141b`

## Catatan teknis

- `cacheComponents` & `partialPrefetching` aktif → `new Date()` dilarang saat prerender;
  dipakai helper `"use cache"` (`lib/current-year.ts`, `lib/build-date.ts`).
- `npm audit` melaporkan 5 high severity dari scaffold bawaan (belum ditangani).
