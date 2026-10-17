export interface PaymentMethod {
  /** Nilai yang dikirim ke backend / ditampilkan. */
  id: string;
  name: string;
  description?: string;
  /** Biaya tambahan dari metode pembayaran. */
  fee: number;
}

export interface PaymentGroup {
  label: string;
  columns: 1 | 2;
  /**
   * Set `false` untuk menyembunyikan grup ini dari halaman pembayaran
   * sementara waktu — datanya tetap tersimpan, tinggal dibalik jadi `true`.
   */
  enabled?: boolean;
  methods: PaymentMethod[];
}

export const paymentGroups: PaymentGroup[] = [
  {
    label: "QRIS",
    columns: 1,
    enabled: true,
    methods: [
      {
        id: "QRIS",
        name: "QRIS",
        description: "Semua e-wallet & m-banking",
        fee: 0,
      },
    ],
  },
  {
    label: "E-Wallet",
    columns: 2,
    enabled: false,
    methods: [
      { id: "DANA", name: "DANA", fee: 0 },
      { id: "OVO", name: "OVO", fee: 0 },
      { id: "GoPay", name: "GoPay", fee: 0 },
      { id: "ShopeePay", name: "ShopeePay", fee: 0 },
    ],
  },
  {
    label: "Virtual Account",
    columns: 2,
    enabled: false,
    methods: [
      { id: "BCA Virtual Account", name: "BCA VA", description: "Biaya Rp 4.000", fee: 4000 },
      { id: "BRI Virtual Account", name: "BRI VA", description: "Biaya Rp 4.000", fee: 4000 },
      { id: "Mandiri Virtual Account", name: "Mandiri VA", description: "Biaya Rp 4.000", fee: 4000 },
      { id: "BNI Virtual Account", name: "BNI VA", description: "Biaya Rp 4.000", fee: 4000 },
    ],
  },
];

/** Grup yang benar-benar ditampilkan di halaman pembayaran. */
export const activePaymentGroups = paymentGroups.filter(
  (group) => group.enabled !== false,
);

export const defaultPaymentMethodId = "QRIS";

/**
 * Opsi di halaman checkout.
 */
export const checkoutConfig = {
  /**
   * Field nomor WhatsApp untuk kirim struk.
   * Dimatikan sementara — balik jadi `true` kalau mau ditampilkan lagi.
   */
  askWhatsAppForReceipt: false,
};

export function findPaymentMethod(id: string): PaymentMethod | undefined {
  for (const group of activePaymentGroups) {
    const found = group.methods.find((method) => method.id === id);
    if (found) return found;
  }
  return undefined;
}
