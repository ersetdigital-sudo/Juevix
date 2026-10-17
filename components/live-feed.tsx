"use client";

import { useEffect, useState } from "react";

const NAMES = ["Andi", "Sari", "Bima", "Nia", "Fajar", "Rani", "Yoga", "Tia"];

interface LiveEntry {
  id: number;
  name: string;
  option: string;
  product: string;
}

const pool = [
  { product: "Token & Tagihan PLN", options: ["Token 20.000", "Token 50.000", "Token 100.000"] },
  { product: "Pulsa", options: ["Rp 10.000", "Rp 25.000", "Rp 50.000"] },
  { product: "Paket Data", options: ["5 GB / 30 hari", "15 GB / 30 hari", "Unlimited"] },
  { product: "BPJS Kesehatan", options: ["1 Bulan", "2 Bulan", "3 Bulan"] },
  { product: "PDAM", options: ["Tagihan air"] },
  { product: "E-Wallet", options: ["DANA 50.000", "GoPay 50.000", "OVO 50.000"] },
];

let counter = 0;

function makeEntry(): LiveEntry {
  const item = pool[Math.floor(Math.random() * pool.length)];
  const option = item.options[Math.floor(Math.random() * item.options.length)];

  counter += 1;

  return {
    id: counter,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    option,
    product: item.product,
  };
}

/** Umpan transaksi terbaru — hanya berjalan di client setelah mount. */
export function LiveFeed() {
  const [entries, setEntries] = useState<LiveEntry[]>([]);

  useEffect(() => {
    const initial = window.setTimeout(() => {
      setEntries(Array.from({ length: 4 }, makeEntry));
    }, 0);

    const timer = window.setInterval(() => {
      setEntries((current) => [makeEntry(), ...current].slice(0, 4));
    }, 2500);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <ul
      className="mt-4 min-h-[104px] space-y-3 text-sm"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Transaksi terbaru"
    >
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="motion-safe:animate-[fade-in_.4s_ease-out] flex justify-between gap-3"
        >
          <span>
            <b>{entry.name}***</b>{" "}
            <span className="text-muted">
              {entry.option} {entry.product}
            </span>
          </span>
          <span className="shrink-0 text-green-400">Sukses</span>
        </li>
      ))}
    </ul>
  );
}
