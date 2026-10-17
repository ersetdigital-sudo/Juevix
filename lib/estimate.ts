/** Biaya admin default untuk tagihan pascabayar. */
export const ADMIN_FEE = 2500;

/**
 * Simulasi total tagihan (dipakai pada produk pascabayar yang nominalnya
 * baru diketahui setelah nomor pelanggan dicek). Di produksi, angka ini
 * harus diganti dengan hasil inquiry dari biller/PPOB gateway.
 */
export function estimateTotal(
  slug: string,
  customerDigits: number,
  productName: string,
): number {
  switch (slug) {
    case "bpjs":
      return 42000 * (Number(productName[0]) || 1) * 2 + ADMIN_FEE;
    case "pdam":
      return 78000 + customerDigits * 3150 + ADMIN_FEE;
    case "pln":
      return 235000 + customerDigits * 1200 + ADMIN_FEE;
    default:
      return 0;
  }
}
