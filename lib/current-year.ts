import { cacheLife } from "next/cache";

/**
 * Tahun berjalan dibungkus cache supaya bisa dipakai di halaman yang
 * di-prerender (Next.js menolak `new Date()` langsung di luar cache).
 */
export async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}
