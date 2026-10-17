import { marqueeItems } from "@/data/content";

/** Teks berjalan pemisah antar section. Item digandakan agar loop mulus. */
export function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="overflow-hidden border-y border-line bg-panel py-4">
      <div className="marq font-display text-lg font-bold text-muted" aria-hidden="true">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-12">
            <span>{item}</span>
            <span className="text-brand">✦</span>
          </span>
        ))}
      </div>
      <span className="sr-only">
        Layanan Juevix: {marqueeItems.join(", ")}
      </span>
    </div>
  );
}
