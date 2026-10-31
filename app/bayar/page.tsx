import type { Metadata } from "next";
import Link from "next/link";
import { DataUnavailable } from "@/components/data-unavailable";
import { PaymentFlow } from "@/components/payment-flow";
import { getOrderByRef, getPaymentByRef } from "@/lib/db/server";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Pembayaran",
  description:
    "Status dan instruksi pembayaran pesanan Juevix: QRIS, Virtual Account, atau e-wallet.",
  path: "/bayar",
  noIndex: true,
});

export default async function BayarPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const ref = params.ref?.trim();

  if (!ref) {
    return (
      <DataUnavailable message="Pesanan tidak ditemukan. Pilih layanan dulu untuk membuat pesanan baru." />
    );
  }

  const [payment, order] = await Promise.all([
    getPaymentByRef(ref),
    getOrderByRef(ref),
  ]);

  if (!payment.data) {
    return <DataUnavailable message={payment.error} />;
  }

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
        <Link href="/" className="text-sm text-muted hover:text-white">
          ← Kembali ke beranda
        </Link>
        <h1 className="hd-tight mt-3 text-3xl font-extrabold md:text-4xl">
          Pembayaran
        </h1>
        <p className="mt-2 text-muted">
          Simpan kode referensi dan selesaikan pembayaran sebelum batas waktu.
        </p>
        <div className="mt-6">
          <PaymentFlow
            payment={payment.data}
            sn={order.data?.[0]?.sn ?? null}
          />
        </div>
      </div>
    </main>
  );
}
