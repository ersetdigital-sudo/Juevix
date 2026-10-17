export interface NavLink {
  label: string;
  href: string;
  /** Cocokkan path aktif untuk penanda menu aktif. */
  match?: string;
}

export interface NavItem {
  label: string;
  href: string;
  match?: string;
  /**
   * Kalau diisi, item ini dirender sebagai dropdown "Layanan"
   * alih-alih link biasa.
   */
  children?: NavLink[];
}

export const navItems: NavItem[] = [
  { label: "Beranda", href: "/", match: "/" },
  {
    label: "Layanan",
    href: "/#produk",
    children: [
      { label: "Token & Tagihan PLN", href: "/pln", match: "/pln" },
      { label: "Pulsa All Operator", href: "/pulsa", match: "/pulsa" },
      { label: "Paket Data", href: "/paket-data", match: "/paket-data" },
      { label: "BPJS Kesehatan", href: "/bpjs", match: "/bpjs" },
      { label: "PDAM", href: "/pdam", match: "/pdam" },
    ],
  },
  { label: "Cara Order", href: "/#cara" },
  { label: "FAQ", href: "/#faq" },
];

export const footerLinks: NavLink[] = [
  { label: "Bantuan", href: "/#faq" },
  { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
  { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
];
