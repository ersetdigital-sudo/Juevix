"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PaymentInfo } from "@/lib/db/types";
import { fmtDate, mmss, rupiah } from "@/lib/format";
import { cn } from "@/lib/cn";

const STATUS_LABEL: Record<PaymentInfo["status"], string> = {
  menunggu_cek: "Lagi dicek admin",
  menunggu_bayar: "Menunggu pembayaran",
  sudah_bayar: "Pembayaran dicek admin",
  sukses: "Sukses",
  dibatalkan: "Dibatalkan",
};

const STATUS_CLASS: Record<PaymentInfo["status"], string> = {
  menunggu_cek: "bg-amber-400/15 text-amber-300",
  menunggu_bayar: "bg-amber-400/15 text-amber-300",
  sudah_bayar: "bg-sky-400/15 text-sky-300",
  sukses: "bg-green-400/15 text-green-300",
  dibatalkan: "bg-white/10 text-muted",
};

export function PaymentFlow({
  payment,
  sn = null,
}: {
  payment: PaymentInfo;
  sn?: string | null;
}) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (payment.status !== "menunggu_bayar" || !payment.expires_at) {
      setRemaining(null);
      return;
    }
    const target = new Date(payment.expires_at).getTime();
    const update = () => {
      setRemaining(Math.max(0, Math.ceil((target - Date.now()) / 1000)));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [payment.status, payment.expires_at]);

  const expired =
    payment.status === "menunggu_bayar" &&
    remaining !== null &&
    remaining <= 0;
  const status = expired ? "dibatalkan" : payment.status;
  const label = STATUS_LABEL[status];
  const total =
    payment.total !== null ? rupiah(payment.total) : "Belum ditetapkan";
  const waDigits = (payment.wa_cs ?? "").replace(/\D/g, "");
  const waMessage = `Halo CS ${payment.nama_brand}, saya ingin konfirmasi pembayaran:\n\nKode referensi: ${payment.ref}\nProduk: ${payment.nama_produk ?? payment.nama_layanan}\nNomor tujuan: ${payment.nomor_tujuan}\nTotal: ${payment.total !== null ? rupiah(payment.total) : "belum ditetapkan"}\n\nBukti transfer saya lampirkan.`;
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(waMessage)}`
    : null;

  async function copyRef() {
    try {
      await navigator.clipboard.writeText(payment.ref);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setNotice("Kode referensi tidak bisa disalin otomatis.");
    }
  }

  return (
    <section className="panel mx-auto max-w-md p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-sm text-muted">Kode referensi</p>
          <p className="font-display text-xl font-extrabold">{payment.ref}</p>
          <p className="mt-1 text-xs text-muted">{fmtDate(payment.created_at)}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold",
            STATUS_CLASS[status],
          )}
        >
          {label}
        </span>
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm text-muted">
          {payment.nama_produk ?? payment.nama_layanan}
        </p>
        <p className="mt-1 text-sm text-muted">{payment.nomor_tujuan}</p>
        <p className="mt-4 text-sm text-muted">Total bayar</p>
        <p className="font-display text-3xl font-extrabold text-brand">
          {total}
        </p>
      </div>

      {status === "menunggu_cek" && (
        <div className="mt-5 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-200">
          Tagihan sedang dicek admin. Nominal dan link bayar dikirim ke
          WhatsApp kamu pada jam cek{" "}
          {payment.jam_cek_tagihan ?? "08.00 - 21.00"}.
        </div>
      )}

      {status === "menunggu_bayar" && !expired && (
        <>
          <div className="mt-5 rounded-2xl border border-line bg-bg p-5">
            {payment.tipe_metode === "qr" ? (
              <>
                <p className="text-center text-sm text-muted">
                  Scan QRIS di bawah
                </p>
                {payment.qris_image_url ? (
                  <a
                    href={payment.qris_image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block"
                  >
                    <img
                      src={payment.qris_image_url}
                      alt="QRIS pembayaran"
                      className="mx-auto h-auto w-full max-w-[300px] rounded-xl bg-white"
                    />
                  </a>
                ) : null}
                <p className="mt-3 text-center text-xs text-muted">
                  Nominal diisi manual persis{" "}
                  <b className="text-white">{total}</b>.
                </p>
              </>
            ) : payment.tipe_metode === "va" ? (
              <>
                <p className="text-center text-sm text-muted">
                  {payment.metode_bayar}
                </p>
                <p className="font-display mt-2 text-center text-2xl font-extrabold tracking-wider">
                  8808 {payment.ref.slice(-8, -4)} {payment.ref.slice(-4)} 21
                </p>
              </>
            ) : (
              <p className="text-center text-sm text-muted">
                Notifikasi pembayaran dikirim ke aplikasi{" "}
                <b className="text-white">{payment.metode_bayar}</b>.
              </p>
            )}
          </div>

          <p className="mt-4 text-center text-sm text-muted">
            Selesaikan dalam{" "}
            <b className="text-white">
              {remaining === null ? "--:--" : mmss(remaining)}
            </b>
          </p>

          <button
            type="button"
            onClick={() => {
              setNotice(
                "Pembayaran kamu sedang dicek admin. Simpan kode referensi ini.",
              );
              if (waHref) window.open(waHref, "_blank", "noopener,noreferrer");
            }}
            className="btn mt-5 w-full justify-center"
          >
            Saya Sudah Bayar
          </button>
        </>
      )}

      {status === "sudah_bayar" && (
        <div className="mt-5 rounded-2xl border border-sky-400/25 bg-sky-400/10 p-4 text-sm text-sky-200">
          Pembayaran sudah dikonfirmasi. Admin sedang memproses pesanan kamu.
        </div>
      )}

      {status === "sukses" && (
        <div className="mt-5 rounded-2xl border border-green-400/25 bg-green-400/10 p-4 text-sm text-green-200">
          <p className="font-bold">Transaksi sukses.</p>
          {sn ? (
            <p className="mt-2">
              {/PLN/i.test(payment.nama_layanan) ? "Token" : "Serial number"}:{" "}
              <b className="font-mono">{sn}</b>
            </p>
          ) : null}
        </div>
      )}

      {status === "dibatalkan" && (
        <div className="mt-5 rounded-2xl border border-line bg-white/5 p-4 text-sm text-muted">
          Transaksi sudah dibatalkan{expired ? " karena waktu habis" : ""}.
          Silakan buat pesanan baru.
        </div>
      )}

      <div className="mt-5 grid gap-2 border-t border-line pt-5 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-muted">Metode</span>
          <b>{payment.metode_bayar ?? "-"}</b>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted">Biaya admin</span>
          <b>{rupiah(payment.biaya_admin)}</b>
        </div>
        {payment.potongan > 0 ? (
          <div className="flex justify-between gap-3">
            <span className="text-muted">Potongan</span>
            <b className="text-green-400">-{rupiah(payment.potongan)}</b>
          </div>
        ) : null}
        {payment.expires_at && status === "menunggu_bayar" ? (
          <div className="flex justify-between gap-3">
            <span className="text-muted">Batas bayar</span>
            <b>{fmtDate(payment.expires_at)}</b>
          </div>
        ) : null}
      </div>

      {notice ? (
        <p className="mt-4 text-center text-sm text-green-400" aria-live="polite">
          {notice}
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button type="button" onClick={copyRef} className="ghost justify-center">
          {copied ? "Tersalin" : "Salin Referensi"}
        </button>
        <Link
          href={`/?q=${encodeURIComponent(payment.ref)}#cek`}
          className="btn justify-center"
        >
          Cek Status
        </Link>
      </div>

      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block text-center text-sm font-semibold text-brand"
        >
          Hubungi CS via WhatsApp
        </a>
      ) : null}
    </section>
  );
}
