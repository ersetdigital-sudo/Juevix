"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  activePaymentGroups,
  checkoutConfig,
  defaultPaymentMethodId,
  findPaymentMethod,
} from "@/data/payment-methods";
import { digitsOnly, invoiceNumber, mmss, rupiah } from "@/lib/format";
import { cn } from "@/lib/cn";

const PAYMENT_WINDOW_SECONDS = 15 * 60;

export function PaymentFlow() {
  const searchParams = useSearchParams();

  const serviceLabel = searchParams.get("l") ?? "-";
  const customerNumber = searchParams.get("no") ?? "-";
  const product = searchParams.get("p") ?? "-";
  const price = Number(searchParams.get("t") ?? 0) || 0;

  const [methodId, setMethodId] = useState(defaultPaymentMethodId);
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [virtualAccount, setVirtualAccount] = useState("");
  const [remaining, setRemaining] = useState(PAYMENT_WINDOW_SECONDS);
  const [paidMessage, setPaidMessage] = useState("");

  const method = findPaymentMethod(methodId) ?? findPaymentMethod(defaultPaymentMethodId)!;
  const fee = method.fee;
  const total = price + fee;

  // Hitung mundur masa berlaku invoice
  useEffect(() => {
    if (expiresAt === null) return;

    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (price <= 0) {
      setError("Pesanan tidak ditemukan. Pilih layanan dulu ya.");
      return;
    }

    if (
      checkoutConfig.askWhatsAppForReceipt &&
      digitsOnly(whatsapp).length < 9
    ) {
      setError("Isi nomor WhatsApp dulu ya (minimal 9 angka).");
      return;
    }

    setError("");
    setInvoice(invoiceNumber());
    setVirtualAccount(`8808 ${Math.floor(10000000 + Math.random() * 90000000)}`);
    setPaidMessage("");
    setRemaining(PAYMENT_WINDOW_SECONDS);
    setExpiresAt(Date.now() + PAYMENT_WINDOW_SECONDS * 1000);
  };

  if (invoice) {
    return (
      <section className="panel mx-auto max-w-md p-6 text-center">
        <p className="text-sm text-muted">Invoice</p>
        <p className="font-display text-xl font-extrabold">{invoice}</p>

        <p className="mt-4 text-sm text-muted">Total bayar</p>
        <p className="font-display text-3xl font-extrabold text-brand">
          {rupiah(total)}
        </p>

        <div className="mt-5 rounded-2xl border border-line bg-bg p-5">
          {method.id === "QRIS" ? (
            <>
              <p className="text-sm text-muted">Scan QRIS di bawah</p>
              <a
                href="/images/payments/qris.jpg"
                target="_blank"
                rel="noreferrer"
                className="mt-3 block"
              >
                <Image
                  src="/images/payments/qris.jpg"
                  alt="Poster QRIS merchant ASWAR MOBILE GEN, NMID ID1026469692366"
                  width={1135}
                  height={1600}
                  sizes="(max-width: 640px) 90vw, 300px"
                  className="mx-auto h-auto w-full max-w-[300px] rounded-xl bg-white"
                />
              </a>
              <p className="mt-3 text-xs text-muted">
                Ketuk gambar untuk membuka ukuran penuh. Nominal diisi manual
                sesuai total di atas.
              </p>
            </>
          ) : method.id.includes("Virtual Account") ? (
            <>
              <p className="text-sm text-muted">{method.id}</p>
              <p className="font-display mt-2 text-2xl font-extrabold tracking-wider">
                {virtualAccount}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">
              Notifikasi pembayaran dikirim ke aplikasi {method.name}
            </p>
          )}
        </div>

        <p className="mt-4 text-sm text-muted">
          Selesaikan dalam{" "}
          <b className="text-white">{mmss(remaining)}</b>
        </p>

        <button
          type="button"
          onClick={() =>
            setPaidMessage(
              checkoutConfig.askWhatsAppForReceipt
                ? "Terima kasih! Pembayaran sedang diverifikasi, struk dikirim ke WhatsApp."
                : "Terima kasih! Pembayaran sedang diverifikasi.",
            )
          }
          className="btn mt-5 w-full justify-center"
        >
          Saya Sudah Bayar
        </button>

        <p aria-live="polite" className="mt-3 text-sm text-green-400">
          {paidMessage}
        </p>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="panel min-w-0 p-6">
        <h2 className="font-bold">Metode Pembayaran</h2>

        {activePaymentGroups.map((group) => (
          <fieldset key={group.label} className="mt-5">
            <legend className="text-xs font-bold uppercase tracking-widest text-muted">
              {group.label}
            </legend>
            <div
              className={cn(
                "mt-2 grid gap-2",
                group.columns === 2 && "sm:grid-cols-2",
              )}
            >
              {group.methods.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={methodId === item.id}
                  onClick={() => setMethodId(item.id)}
                  className={cn("pm", methodId === item.id && "is-active")}
                >
                  <span>
                    <b>{item.name}</b>
                    {item.description && (
                      <span className="block text-xs text-muted">
                        {item.description}
                      </span>
                    )}
                  </span>
                  <span className="dot" aria-hidden="true" />
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        {checkoutConfig.askWhatsAppForReceipt && (
          <>
            <label htmlFor="whatsapp" className="mt-6 block text-sm font-bold">
              No. WhatsApp (untuk kirim struk)
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              inputMode="numeric"
              autoComplete="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              className="field mt-2"
              placeholder="08xxxxxxxxxx"
            />
          </>
        )}
      </div>

      <aside className="panel h-max p-6 lg:sticky lg:top-24">
        <h2 className="font-bold">Ringkasan Pesanan</h2>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Layanan</dt>
            <dd className="text-right">{serviceLabel}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Nomor</dt>
            <dd className="break-all text-right">{customerNumber}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Produk</dt>
            <dd className="text-right">{product}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Harga</dt>
            <dd className="text-right">{price > 0 ? rupiah(price) : "-"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Biaya metode</dt>
            <dd className="text-right">{rupiah(fee)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="text-muted">Total</span>
          <b className="text-xl text-brand">{price > 0 ? rupiah(total) : "-"}</b>
        </div>

        <button type="submit" className="btn mt-5 w-full justify-center">
          Bayar Sekarang
        </button>

        <p aria-live="polite" className="mt-3 text-center text-sm text-red-400">
          {error}
        </p>

        <p className="mt-4 text-center text-xs text-muted">
          Metode terpilih: {method.name}
        </p>
      </aside>
    </form>
  );
}

export function PaymentBackLink() {
  const searchParams = useSearchParams();
  const service = searchParams.get("s");
  const href = service ? `/${service}` : "/";

  return (
    <Link href={href} className="text-sm text-muted transition-colors hover:text-white">
      ← Kembali
    </Link>
  );
}
