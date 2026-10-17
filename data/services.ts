export interface ServiceOption {
  /** Nama produk yang dikirim ke halaman pembayaran. */
  name: string;
  /** Teks tampil kalau berbeda dari nama produk. */
  caption?: string;
  /** 0 = nominal ditentukan setelah nomor pelanggan dicek. */
  price: number;
  /** Teks pengganti harga (mis. "Cek tagihan", "Admin Rp 2.500"). */
  note?: string;
}

export interface ServiceGroup {
  label: string;
  options: ServiceOption[];
}

export interface Service {
  slug: string;
  title: string;
  sprite: number;
  description: string;
  input: {
    label: string;
    placeholder: string;
    inputMode: "numeric" | "tel";
  };
  groups: ServiceGroup[];
  /** Dropdown wilayah (khusus PDAM). */
  regionSelect?: {
    label: string;
    options: string[];
  };
  /** Tampilkan deteksi operator dari prefix nomor HP. */
  detectOperator?: boolean;
  notes: string[];
  meta: {
    title: string;
    description: string;
  };
}

export const services: Service[] = [
  {
    slug: "pln",
    title: "Token & Tagihan PLN",
    sprite: 0,
    description:
      "Beli token listrik prabayar atau bayar tagihan pascabayar. Token terbit otomatis dalam hitungan detik.",
    input: {
      label: "Nomor Meter / ID Pelanggan",
      placeholder: "Contoh: 532110987654",
      inputMode: "numeric",
    },
    groups: [
      {
        label: "Token Listrik",
        options: [
          { name: "Token 20.000", price: 21500 },
          { name: "Token 50.000", price: 51500 },
          { name: "Token 100.000", price: 101500 },
          { name: "Token 200.000", price: 201500 },
          { name: "Token 500.000", price: 501500 },
          { name: "Token 1.000.000", price: 1001500 },
        ],
      },
      {
        label: "Tagihan Pascabayar",
        options: [
          {
            name: "Tagihan Pascabayar",
            caption: "Cek & bayar tagihan bulan ini",
            price: 0,
            note: "Admin Rp 2.500",
          },
        ],
      },
    ],
    notes: [
      "Pastikan nomor meter sesuai yang tertera di kWh meter.",
      "Token 20 digit dikirim via WhatsApp & email.",
      "Tagihan pascabayar bisa dibayar mulai tanggal 1 setiap bulan.",
    ],
    meta: {
      title: "Token & Tagihan PLN",
      description:
        "Beli token listrik PLN prabayar dan bayar tagihan listrik pascabayar di Juevix. Token 20 digit terbit otomatis dalam hitungan detik, admin mulai Rp 2.500.",
    },
  },
  {
    slug: "pulsa",
    title: "Pulsa All Operator",
    sprite: 1,
    description:
      "Isi pulsa Telkomsel, Indosat, XL, Axis, Tri, dan Smartfren. Operator terdeteksi otomatis dari nomor.",
    input: {
      label: "Nomor HP",
      placeholder: "Contoh: 0812xxxxxxxx",
      inputMode: "tel",
    },
    detectOperator: true,
    groups: [
      {
        label: "Pulsa Reguler",
        options: [
          { name: "Rp 5.000", price: 6500 },
          { name: "Rp 10.000", price: 11000 },
          { name: "Rp 20.000", price: 20800 },
          { name: "Rp 25.000", price: 25500 },
          { name: "Rp 50.000", price: 50000 },
          { name: "Rp 100.000", price: 99000 },
        ],
      },
      {
        label: "Paket Data",
        options: [
          { name: "5 GB / 30 hari", price: 30000 },
          { name: "15 GB / 30 hari", price: 62000 },
          { name: "30 GB / 30 hari", price: 95000 },
          { name: "Unlimited / 30 hari", price: 120000 },
        ],
      },
    ],
    notes: [
      "Pulsa masuk otomatis 1–10 detik.",
      "Cek kembali nomor sebelum membayar.",
      "Pulsa yang sudah masuk tidak dapat dibatalkan.",
    ],
    meta: {
      title: "Pulsa All Operator",
      description:
        "Isi pulsa Telkomsel, Indosat, XL, Axis, Tri, dan Smartfren di Juevix. Harga mulai Rp 6.500, masuk otomatis 1–10 detik tanpa perlu daftar akun.",
    },
  },
  {
    slug: "paket-data",
    title: "Paket Data",
    sprite: 2,
    description:
      "Beli kuota internet Telkomsel, Indosat, XL, Axis, Tri, dan Smartfren. Operator terdeteksi otomatis dari nomor.",
    input: {
      label: "Nomor HP",
      placeholder: "Contoh: 0812xxxxxxxx",
      inputMode: "tel",
    },
    detectOperator: true,
    groups: [
      {
        label: "Pilih Paket",
        options: [
          { name: "Harian 1 GB / 1 hari", price: 5000 },
          { name: "Mingguan 3 GB / 7 hari", price: 15000 },
          { name: "5 GB / 30 hari", price: 30000 },
          { name: "10 GB / 30 hari", price: 50000 },
          { name: "15 GB / 30 hari", price: 62000 },
          { name: "30 GB / 30 hari", price: 95000 },
          { name: "50 GB / 30 hari", price: 135000 },
          { name: "Unlimited / 30 hari", price: 120000 },
          { name: "Kuota Malam 20 GB", price: 25000 },
        ],
      },
    ],
    notes: [
      "Kuota aktif otomatis 1–10 detik.",
      "Cek kembali nomor sebelum membayar.",
      "Masa aktif & kuota mengikuti ketentuan operator.",
    ],
    meta: {
      title: "Paket Data",
      description:
        "Beli paket data & kuota internet semua operator di Juevix. Mulai Rp 5.000, aktif otomatis 1–10 detik, tanpa biaya admin tersembunyi.",
    },
  },
  {
    slug: "bpjs",
    title: "BPJS Kesehatan",
    sprite: 4,
    description:
      "Bayar iuran BPJS Kesehatan untuk kamu dan keluarga. Bisa sekaligus beberapa bulan.",
    input: {
      label: "Nomor VA Keluarga",
      placeholder: "Contoh: 8888801234567890",
      inputMode: "numeric",
    },
    groups: [
      {
        label: "Bayar untuk",
        options: [
          { name: "1 Bulan", price: 0, note: "Cek tagihan" },
          { name: "2 Bulan", price: 0, note: "Cek tagihan" },
          { name: "3 Bulan", price: 0, note: "Cek tagihan" },
          { name: "6 Bulan", price: 0, note: "Cek tagihan" },
        ],
      },
    ],
    notes: [
      "Gunakan nomor VA keluarga (16 digit) dari kartu BPJS.",
      "Total iuran mengikuti jumlah anggota & kelas.",
      "Biaya admin Rp 2.500 per transaksi.",
    ],
    meta: {
      title: "BPJS Kesehatan",
      description:
        "Bayar iuran BPJS Kesehatan online di Juevix. Bisa untuk 1, 2, 3, atau 6 bulan sekaligus, struk resmi dikirim via WhatsApp. Admin Rp 2.500.",
    },
  },
  {
    slug: "pdam",
    title: "PDAM",
    sprite: 3,
    description:
      "Bayar tagihan air PDAM di ratusan wilayah Indonesia. Cek tagihan otomatis, struk resmi.",
    input: {
      label: "ID Pelanggan PDAM",
      placeholder: "Contoh: 01234567",
      inputMode: "numeric",
    },
    regionSelect: {
      label: "Wilayah PDAM",
      options: [
        "PDAM Jakarta (PAM Jaya)",
        "PDAM Surya Sembada Surabaya",
        "PDAM Tirtawening Bandung",
        "PDAM Tirta Moedal Semarang",
        "PDAM Tirtanadi Medan",
        "PDAM Kota Makassar",
      ],
    },
    groups: [],
    notes: [
      "ID pelanggan tertera di rekening air bulan lalu.",
      "Pembayaran mulai tanggal 1–20 setiap bulan untuk hindari denda.",
      "Biaya admin Rp 2.500.",
    ],
    meta: {
      title: "PDAM",
      description:
        "Bayar tagihan air PDAM Jakarta, Surabaya, Bandung, Semarang, Medan, dan Makassar di Juevix. Cek tagihan otomatis, biaya admin Rp 2.500.",
    },
  },
];

export const servicesBySlug = Object.fromEntries(
  services.map((service) => [service.slug, service]),
) as Record<string, Service>;

export function getService(slug: string): Service {
  const service = servicesBySlug[slug];
  if (!service) throw new Error(`Service "${slug}" tidak ditemukan`);
  return service;
}
