export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "Berapa lama proses pembayaran?",
    answer:
      "Umumnya 1–10 detik. Token PLN & struk tagihan langsung terbit setelah pembayaran terkonfirmasi.",
  },
  {
    question: "Apakah harus daftar akun?",
    answer:
      "Tidak. Cukup isi ID pelanggan dan nomor WhatsApp untuk bukti transaksi.",
  },
  {
    question: "Bagaimana jika salah input nomor?",
    answer:
      "Segera hubungi CS kami. Transaksi yang sudah terkirim ke ID yang salah tidak dapat dibatalkan.",
  },
  {
    question: "Metode pembayaran apa saja?",
    answer:
      "QRIS, Virtual Account semua bank, DANA, OVO, GoPay, ShopeePay, dan minimarket.",
  },
];
