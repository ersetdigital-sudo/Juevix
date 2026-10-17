/** Rp 21.500 */
export function rupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

/** Ambil hanya digit dari input bebas (mis. "0812-3456" -> "08123456"). */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** NXS-123456 */
export function invoiceNumber(): string {
  return `NXS-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** 15:00 */
export function mmss(totalSeconds: number): string {
  return `${pad2(Math.floor(totalSeconds / 60))}:${pad2(totalSeconds % 60)}`;
}
