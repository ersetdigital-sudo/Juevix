type ClassValue = string | false | null | undefined;

/** Gabung className tanpa perlu dependensi tambahan. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
