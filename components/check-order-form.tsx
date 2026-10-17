"use client";

import { useState } from "react";

const INVOICE_PATTERN = /^NXS-\d{6}$/i;

export function CheckOrderForm() {
  const [invoice, setInvoice] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  return (
    <>
      <form
        className="mt-6 grid gap-2"
        style={{ gridTemplateColumns: "minmax(0,1fr) auto" }}
        onSubmit={(event) => {
          event.preventDefault();

          if (!INVOICE_PATTERN.test(invoice.trim())) {
            setResult({
              ok: false,
              message: "Format invoice tidak sesuai. Contoh: NXS-123456.",
            });
            return;
          }

          // TODO: ganti dengan pemanggilan API status pesanan.
          setResult({
            ok: true,
            message: "Pesanan sudah terkirim ke akun tujuan.",
          });
        }}
      >
        <label htmlFor="invoice" className="sr-only">
          Nomor invoice
        </label>
        <input
          id="invoice"
          name="invoice"
          required
          placeholder="NXS-XXXXXX"
          value={invoice}
          onChange={(event) => setInvoice(event.target.value)}
          className="field"
        />
        <button type="submit" className="btn">
          Cek
        </button>
      </form>

      <p
        aria-live="polite"
        className={
          result
            ? `mt-4 text-sm ${result.ok ? "text-green-400" : "text-red-400"}`
            : "mt-4 text-sm text-muted"
        }
      >
        {result ? (
          <>
            {result.ok && (
              <span aria-hidden="true" className="mr-1">
                ●
              </span>
            )}
            {result.message}
          </>
        ) : (
          "Status pesanan akan tampil di sini."
        )}
      </p>
    </>
  );
}
