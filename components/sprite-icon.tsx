import Image from "next/image";
import { cn } from "@/lib/cn";

const SPRITE_SRC = "/images/brand/sprite-services.png";
const SPRITE_WIDTH = 1376;
const SPRITE_HEIGHT = 768;
const SPRITE_COLUMNS = 4;

interface SpriteIconProps {
  /** 0 = zap PLN, 1 = phone, 2 = wifi, 3 = drop, 4 = heart, 5 = tv, 6 = wallet, 7 = car */
  index: number;
  className?: string;
  priority?: boolean;
}

/**
 * Ikon 3D diambil dari satu sprite sheet (4 kolom x 2 baris).
 * Posisi dihitung dengan menggeser gambar sebesar 100% per kolom/baris.
 */
export function SpriteIcon({ index, className, priority = false }: SpriteIconProps) {
  const column = index % SPRITE_COLUMNS;
  const row = Math.floor(index / SPRITE_COLUMNS);

  return (
    <span className={cn("sprite", className)} aria-hidden="true">
      <span className="sprite-frame">
        <Image
          src={SPRITE_SRC}
          alt=""
          width={SPRITE_WIDTH}
          height={SPRITE_HEIGHT}
          priority={priority}
          className="sprite-img"
          style={{ left: `${-column * 100}%`, top: `${-row * 100}%` }}
        />
      </span>
    </span>
  );
}
