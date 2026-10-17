export interface Testimonial {
  quote: string;
  author: string;
  city: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Beli token listrik jam 11 malam, 5 detik langsung keluar. Adminnya lebih murah dari minimarket!",
    author: "Raka",
    city: "Bandung",
    rating: 5,
  },
  {
    quote:
      "Bayar BPJS sama PDAM sekalian di sini, struknya rapi dan CS fast respon.",
    author: "Dinda",
    city: "Surabaya",
    rating: 5,
  },
];

export interface OrderStep {
  step: string;
  title: string;
  description: string;
}

export const orderSteps: OrderStep[] = [
  {
    step: "01",
    title: "Pilih layanan",
    description: "PLN, pulsa, BPJS, PDAM, atau layanan lain.",
  },
  {
    step: "02",
    title: "Masukkan nomor",
    description: "Isi ID pelanggan / nomor HP, tagihan dicek otomatis.",
  },
  {
    step: "03",
    title: "Bayar",
    description: "QRIS, transfer VA, DANA, OVO, GoPay, ShopeePay.",
  },
  {
    step: "04",
    title: "Selesai",
    description: "Token/struk terbit otomatis, dikirim via WhatsApp.",
  },
];

export const marqueeItems = [
  "TOKEN PLN",
  "PULSA & DATA",
  "BPJS KESEHATAN",
  "PDAM",
  "INTERNET & TV",
  "E-WALLET",
];
