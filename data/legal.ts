export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  description: string;
  /** Sudah dalam format tampil, mis. "1 Januari 2026". */
  updatedAt: string;
  sections: LegalSection[];
}

/**
 * Catatan: isi di bawah masih draft generik.
 * WAJIB direview tim legal sebelum dipublikasikan ke produksi.
 */
export const legalDocuments: Record<"terms" | "privacy", LegalDocument> = {
  terms: {
    slug: "syarat-ketentuan",
    title: "Syarat & Ketentuan",
    description:
      "Syarat dan ketentuan penggunaan layanan pembayaran online Juevix.",
    updatedAt: "1 Januari 2026",
    sections: [
      {
        heading: "1. Ruang lingkup layanan",
        paragraphs: [
          "Juevix menyediakan layanan pembelian pulsa, paket data, token listrik, serta pembayaran tagihan (PLN pascabayar, BPJS Kesehatan, PDAM, internet, dan cicilan) sebagai mitra penjual produk digital dan biller resmi.",
          "Layanan dapat digunakan tanpa pendaftaran akun. Nomor WhatsApp wajib diisi untuk pengiriman bukti transaksi.",
        ],
      },
      {
        heading: "2. Pembayaran",
        paragraphs: [
          "Pembayaran dilakukan melalui QRIS, Virtual Account bank, atau dompet digital yang tersedia pada halaman pembayaran. Biaya tambahan dari metode pembayaran (jika ada) ditampilkan sebelum kamu menekan tombol Bayar Sekarang.",
          "Invoice memiliki batas waktu penyelesaian. Pesanan yang tidak dibayar hingga batas waktu berakhir akan dibatalkan secara otomatis.",
        ],
      },
      {
        heading: "3. Kesalahan input",
        paragraphs: [
          "Pastikan ID pelanggan atau nomor tujuan sudah benar sebelum membayar. Transaksi yang telah berhasil dikirim ke nomor atau ID tujuan tidak dapat dibatalkan atau dikembalikan.",
        ],
      },
      {
        heading: "4. Pembatalan dan pengembalian dana",
        paragraphs: [
          "Pembatalan hanya dimungkinkan jika transaksi gagal dari sisi sistem kami atau biller. Dalam kondisi tersebut, dana dikembalikan ke metode pembayaran asal sesuai kebijakan penyedia pembayaran.",
        ],
      },
      {
        heading: "5. Batasan tanggung jawab",
        paragraphs: [
          "Juevix tidak bertanggung jawab atas keterlambatan yang disebabkan oleh gangguan sistem operator, biller, atau penyedia pembayaran di luar kendali kami.",
        ],
      },
      {
        heading: "6. Perubahan ketentuan",
        paragraphs: [
          "Ketentuan ini dapat diperbarui sewaktu-waktu. Versi terbaru selalu tersedia di halaman ini beserta tanggal pembaruannya.",
        ],
      },
    ],
  },
  privacy: {
    slug: "kebijakan-privasi",
    title: "Kebijakan Privasi",
    description:
      "Bagaimana Juevix mengumpulkan, menggunakan, dan melindungi data pengguna.",
    updatedAt: "1 Januari 2026",
    sections: [
      {
        heading: "1. Data yang kami kumpulkan",
        paragraphs: [
          "Kami mengumpulkan data yang kamu isi sendiri saat bertransaksi: nomor pelanggan / nomor HP tujuan, nomor WhatsApp untuk pengiriman struk, serta metode pembayaran yang dipilih.",
        ],
      },
      {
        heading: "2. Penggunaan data",
        paragraphs: [
          "Data digunakan untuk memproses transaksi, mengirim bukti pembayaran, menangani keluhan, serta mencegah penyalahgunaan layanan.",
        ],
      },
      {
        heading: "3. Berbagi data dengan pihak ketiga",
        paragraphs: [
          "Data hanya dibagikan sebatas kebutuhan transaksi kepada biller terkait, agregator produk digital, dan penyedia jasa pembayaran. Kami tidak menjual data pengguna.",
        ],
      },
      {
        heading: "4. Penyimpanan dan keamanan",
        paragraphs: [
          "Data transaksi disimpan dalam jangka waktu yang diperlukan untuk keperluan pembukuan dan kepatuhan hukum, dengan pembatasan akses pada pihak yang berkepentingan.",
        ],
      },
      {
        heading: "5. Hak pengguna",
        paragraphs: [
          "Kamu dapat meminta informasi, koreksi, atau penghapusan data pribadi dengan menghubungi kanal kontak resmi Juevix.",
        ],
      },
    ],
  },
};
