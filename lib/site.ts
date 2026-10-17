/**
 * Konfigurasi situs terpusat.
 * Ganti nilai di bawah (atau isi lewat env) sebelum deploy ke produksi.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://juevix.id";

export const site = {
  name: "Juevix",
  shortName: "Juevix",
  tagline: "PPOB: Bayar Tagihan, Pulsa & Token PLN Instan",
  description:
    "Juevix melayani pembayaran token PLN, pulsa, paket data, BPJS Kesehatan, PDAM, internet, dan cicilan. Proses otomatis dalam hitungan detik, buka 24 jam, biaya admin paling hemat.",
  url: SITE_URL,
  locale: "id_ID",
  language: "id",
  keywords: [
    "ppob",
    "bayar tagihan online",
    "token listrik",
    "pulsa murah",
    "paket data",
    "bpjs kesehatan",
    "pdam",
    "bayar listrik online",
    "juevix",
  ],
  /** TODO: isi nomor WhatsApp CS (format 62812xxxxxxx). */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP?.trim() ?? "",
  /** TODO: isi email CS. */
  email: process.env.NEXT_PUBLIC_EMAIL?.trim() ?? "",
  stats: [
    { value: "2jt+", label: "Transaksi sukses" },
    { value: "3 dtk", label: "Rata-rata proses" },
    { value: "4.9★", label: "Rating pelanggan" },
  ],
  promo: {
    title: "⚡ Promo admin Rp0 berakhir dalam",
    description: "Bebas biaya admin untuk tagihan PLN, PDAM & BPJS.",
    /** Durasi promo (dihitung dari saat halaman dibuka). */
    durationSeconds: 5 * 3600 + 23 * 60,
    cashbackCode: "JUEVIX",
    cashbackValue: "5%",
  },
} as const;

export const siteUrl = (path = "/") =>
  `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
