export const productCategories = [
  "Semua",
  "Listrik",
  "Pulsa & Data",
  "Tagihan",
  "E-Wallet",
  "Cicilan",
] as const;

export type ProductCategory = (typeof productCategories)[number];

export interface ProductOption {
  label: string;
  price: number;
}

export interface Product {
  id: string;
  title: string;
  category: Exclude<ProductCategory, "Semua">;
  /** Posisi ikon 3D pada sprite sheet public/images/brand/sprite-services.png */
  sprite: number;
  accent: string;
  hot: boolean;
  /** Kalau ada, kartu langsung mengarah ke halaman layanan (bukan modal). */
  href?: string;
  priceNote: string;
  options: ProductOption[];
}

export const products: Product[] = [
  {
    id: "pln",
    title: "Token & Tagihan PLN",
    category: "Listrik",
    sprite: 0,
    accent: "#FF7A00",
    hot: true,
    href: "/pln",
    priceNote: "Mulai Rp 21.500",
    options: [
      { label: "Token 20.000", price: 21500 },
      { label: "Token 50.000", price: 51500 },
      { label: "Token 100.000", price: 101500 },
      { label: "Tagihan PLN (admin)", price: 2500 },
    ],
  },
  {
    id: "pulsa",
    title: "Pulsa",
    category: "Pulsa & Data",
    sprite: 1,
    accent: "#EF4444",
    hot: true,
    href: "/pulsa",
    priceNote: "Mulai Rp 11.000",
    options: [
      { label: "Rp 10.000", price: 11000 },
      { label: "Rp 25.000", price: 25500 },
      { label: "Rp 50.000", price: 50000 },
      { label: "Rp 100.000", price: 99000 },
    ],
  },
  {
    id: "paket-data",
    title: "Paket Data",
    category: "Pulsa & Data",
    sprite: 2,
    accent: "#06B6D4",
    hot: true,
    href: "/paket-data",
    priceNote: "Mulai Rp 30.000",
    options: [
      { label: "5 GB / 30 hari", price: 30000 },
      { label: "15 GB / 30 hari", price: 62000 },
      { label: "30 GB / 30 hari", price: 95000 },
      { label: "Unlimited", price: 120000 },
    ],
  },
  {
    id: "pdam",
    title: "PDAM",
    category: "Tagihan",
    sprite: 3,
    accent: "#3B82F6",
    hot: false,
    href: "/pdam",
    priceNote: "Admin mulai Rp 2.500",
    options: [],
  },
  {
    id: "bpjs",
    title: "BPJS Kesehatan",
    category: "Tagihan",
    sprite: 4,
    accent: "#16A34A",
    hot: true,
    href: "/bpjs",
    priceNote: "Iuran mulai Rp 42.000",
    options: [],
  },
  {
    id: "internet-tv",
    title: "Internet & TV",
    category: "Tagihan",
    sprite: 5,
    accent: "#8B5CF6",
    hot: false,
    priceNote: "Admin mulai Rp 2.500",
    options: [
      { label: "IndiHome", price: 2500 },
      { label: "Biznet", price: 2500 },
      { label: "First Media", price: 2500 },
      { label: "MNC Vision", price: 2500 },
    ],
  },
  {
    id: "e-wallet",
    title: "E-Wallet",
    category: "E-Wallet",
    sprite: 6,
    accent: "#0EA5E9",
    hot: false,
    priceNote: "Mulai Rp 51.000",
    options: [
      { label: "DANA 50.000", price: 51000 },
      { label: "GoPay 50.000", price: 51000 },
      { label: "OVO 50.000", price: 51500 },
      { label: "ShopeePay 50.000", price: 51500 },
    ],
  },
  {
    id: "multifinance",
    title: "Multifinance",
    category: "Cicilan",
    sprite: 7,
    accent: "#DC2626",
    hot: false,
    priceNote: "Admin mulai Rp 5.000",
    options: [
      { label: "Adira Finance", price: 5000 },
      { label: "FIF Group", price: 5000 },
      { label: "BAF", price: 5000 },
      { label: "WOM Finance", price: 5000 },
    ],
  },
];
