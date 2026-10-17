import { cacheLife } from "next/cache";

/**
 * Tanggal build yang dibungkus cache — dipakai untuk `lastModified` sitemap
 * supaya rute tetap bisa di-prerender (bukan dynamic).
 */
export async function getLastModified(): Promise<Date> {
  "use cache";
  cacheLife("days");

  return new Date();
}
