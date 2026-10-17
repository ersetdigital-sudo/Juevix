import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentBackLink, PaymentFlow } from "@/components/payment-flow";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Pembayaran",
  description:
    "Pilih metode pembayaran QRIS, Virtual Account, atau e-wallet untuk menyelesaikan pesanan Juevix.",
  path: "/bayar",
  // Halaman pembayaran tidak perlu diindeks mesin pencari.
  noIndex: true,
});

export default function BayarPage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
        <Suspense
          fallback={<p className="text-sm text-muted">Memuat detail pesanan…</p>}
        >
          <PaymentBackLink />
          <h1 className="hd-tight mt-3 text-3xl font-extrabold md:text-4xl">
            Pembayaran
          </h1>
          <p className="mt-2 text-muted">
            Pilih metode pembayaran untuk menyelesaikan pesanan.
          </p>
          <PaymentFlow />
        </Suspense>
      </div>
    </main>
  );
}
