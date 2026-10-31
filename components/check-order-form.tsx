"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { checkOrder } from "@/lib/db/client";
import { toPublicError } from "@/lib/db/errors";
import type { OrderLookup } from "@/lib/db/types";
import { rupiah } from "@/lib/format";

const STATUS_LABEL: Record<OrderLookup["status"], string> = {
  menunggu_cek: "Lagi dicek admin",
  menunggu_bayar: "Menunggu pembayaran",
  sudah_bayar: "Pembayaran dicek admin",
  sukses: "Sukses",
  dibatalkan: "Dibatalkan",
};

type Result = {
  ok: boolean;
  message: string;
  order?: OrderLookup;
};

export function CheckOrderForm({ brandSlug }: { brandSlug: string }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  async function lookup(value: string) {
    const q = value.trim();
    if (!q) {
      setResult({
        ok: false,
        message: "Masukkan kode referensi atau nomor tujuan dulu ya.",
      });
      return;
    }

    setBusy(true);
    setResult(null);
    try {
      const isRef = /[A-Z]/i.test(q);
      const orders = await checkOrder({
        brandSlug,
        ref: isRef ? q.replace(/\s/g, "").toUpperCase() : null,
        nomorTujuan: isRef ? null : q.replace(/\D/g, ""),
      });
      const order = orders[0];
      if (!order) {
        setResult({
          ok: false,
          message: "Pesanan tidak ditemukan. Cek kembali kode referensi atau nomor tujuan.",
        });
        return;
      }
      setResult({
        ok: true,
        message:
          orders.length > 1
            ? `${orders.length} pesanan ditemukan. Menampilkan yang terbaru.`
            : "Pesanan ditemukan.",
        order,
      });
    } catch (error) {
      setResult({ ok: false, message: toPublicError(error).message });
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (!initial) return;
    setQuery(initial);
    void lookup(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandSlug]);

  const order = result?.order;

  return (
    <>
      <form
        className="mt-6 grid gap-2"
        style={{ gridTemplateColumns: "minmax(0,1fr) auto" }}
        onSubmit={(event) => {
          event.preventDefault();
          void lookup(query);
        }}
      >
        <label htmlFor="invoice" className="sr-only">
          Kode referensi atau nomor tujuan
        </label>
        <input
          id="invoice"
          name="invoice"
          required
          placeholder="JVX-261031-XXXXXX / 0812..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="field"
        />
        <button type="submit" className="btn" disabled={busy}>
          {busy ? "Mencari…" : "Cek"}
        </button>
      </form>

      <div
        aria-live="polite"
        className={
          result
            ? `mt-4 text-sm ${result.ok ? "text-green-400" : "text-red-400"}`
            : "mt-4 text-sm text-muted"
        }
      >
        {result ? (
          <>
            <p>{result.message}</p>
            {order ? (
              <div className="mt-3 rounded-2xl border border-line bg-panel-2 p-4 text-sm text-ink">
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Kode referensi</span>
                  <b className="font-mono">{order.ref}</b>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-muted">Produk</span>
                  <b className="text-right">
                    {order.produk ?? order.layanan}
                  </b>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-muted">Status</span>
                  <b>{STATUS_LABEL[order.status]}</b>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-muted">Total</span>
                  <b>
                    {order.total !== null ? rupiah(order.total) : "Belum ditetapkan"}
                  </b>
                </div>
                {order.sn ? (
                  <div className="mt-2 flex justify-between gap-3">
                    <span className="text-muted">
                      {/PLN/i.test(order.layanan) ? "Token" : "Serial number"}
                    </span>
                    <b className="font-mono text-brand">{order.sn}</b>
                  </div>
                ) : null}
                {order.status === "menunggu_bayar" ||
                order.status === "menunggu_cek" ? (
                  <Link
                    href={`/bayar?ref=${encodeURIComponent(order.ref)}`}
                    className="btn mt-4 w-full justify-center"
                  >
                    Buka Pembayaran
                  </Link>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          "Status pesanan akan tampil di sini."
        )}
      </div>
    </>
  );
}
