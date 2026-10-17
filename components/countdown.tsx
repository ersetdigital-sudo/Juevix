"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { pad2 } from "@/lib/format";

const UNIT_LABELS = ["Jam", "Menit", "Detik"];

/** Countdown promo. Di-render kosong di server agar tidak ada hydration mismatch. */
export function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const end = Date.now() + site.promo.durationSeconds * 1000;
    const tick = () =>
      setRemaining(Math.max(0, Math.floor((end - Date.now()) / 1000)));

    // Nilai awal dihitung setelah commit supaya tidak memicu cascading render.
    const initial = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  const values =
    remaining === null
      ? [null, null, null]
      : [
          Math.floor(remaining / 3600),
          Math.floor((remaining % 3600) / 60),
          remaining % 60,
        ];

  return (
    <div className="flex gap-3 text-center" role="timer" aria-live="off">
      <span className="sr-only">{site.promo.description}</span>
      {values.map((value, index) => (
        <div
          key={UNIT_LABELS[index]}
          className="rounded-xl border border-line bg-bg px-4 py-3"
        >
          <p className="font-display text-3xl font-extrabold text-brand">
            {value === null ? "--" : pad2(value)}
          </p>
          <p className="text-xs text-muted">{UNIT_LABELS[index]}</p>
        </div>
      ))}
    </div>
  );
}
