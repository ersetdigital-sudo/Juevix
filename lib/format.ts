/** Rp 21.500 */
export function rupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

/** Ambil hanya digit dari input bebas (mis. "0812-3456" -> "08123456"). */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** 15:00 */
export function mmss(totalSeconds: number): string {
  return `${pad2(Math.floor(totalSeconds / 60))}:${pad2(totalSeconds % 60)}`;
}

/** 31 Okt 2026, 12.30 */
export function fmtDate(value: string | number | Date | null | undefined): string {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
