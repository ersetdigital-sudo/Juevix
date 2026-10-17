export interface OperatorLogo {
  src: string;
  width: number;
  height: number;
}

export interface Operator {
  name: string;
  /** Warna badge kalau logo resmi tidak tersedia (Tri, by.U). */
  color: string;
  prefixes: string[];
  logo?: OperatorLogo;
}

export const operators: Operator[] = [
  {
    name: "Telkomsel",
    color: "#E3262F",
    prefixes: ["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"],
    logo: { src: "/images/operators/telkomsel.png", width: 1644, height: 480 },
  },
  {
    name: "Indosat",
    color: "#FFC20E",
    prefixes: ["0814", "0815", "0816", "0855", "0856", "0857", "0858"],
    logo: { src: "/images/operators/indosat.svg", width: 155, height: 54 },
  },
  {
    name: "XL",
    color: "#1D4F9C",
    prefixes: ["0817", "0818", "0819", "0859", "0877", "0878"],
    logo: { src: "/images/operators/xl.png", width: 300, height: 240 },
  },
  {
    name: "Axis",
    color: "#7B2D8E",
    prefixes: ["0831", "0832", "0833", "0838"],
    logo: { src: "/images/operators/axis.svg", width: 49, height: 34 },
  },
  {
    name: "Tri",
    color: "#E4007F",
    prefixes: ["0895", "0896", "0897", "0898", "0899"],
  },
  {
    name: "Smartfren",
    color: "#E5004F",
    prefixes: ["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"],
    logo: { src: "/images/operators/smartfren.svg", width: 1892, height: 358 },
  },
  {
    name: "by.U",
    color: "#00B2E3",
    prefixes: ["0851"],
  },
];

export type OperatorStatus = "empty" | "unknown" | "too-short" | "too-long" | "found";

export interface OperatorDetection {
  status: OperatorStatus;
  operator: Operator | null;
  /** Nomor dalam format lokal (08xxxxxxxxxx). */
  normalized: string;
  message: string;
}

/** Deteksi operator dari prefix nomor HP (mendukung format 08xx, 8xx, dan 628xx). */
export function detectOperator(rawValue: string): OperatorDetection {
  let normalized = rawValue.replace(/\D/g, "");
  if (normalized.startsWith("62")) normalized = `0${normalized.slice(2)}`;
  if (normalized.startsWith("8")) normalized = `0${normalized}`;

  if (normalized.length < 4) {
    return { status: "empty", operator: null, normalized, message: "" };
  }

  const operator =
    operators.find((item) => item.prefixes.includes(normalized.slice(0, 4))) ?? null;

  if (!operator) {
    return {
      status: "unknown",
      operator: null,
      normalized,
      message: "Nomor tidak dikenali, cek lagi ya",
    };
  }

  if (normalized.length < 10) {
    return {
      status: "too-short",
      operator,
      normalized,
      message: "Lanjutkan nomornya…",
    };
  }

  if (normalized.length > 13) {
    return {
      status: "too-long",
      operator,
      normalized,
      message: "Nomor terlalu panjang",
    };
  }

  return {
    status: "found",
    operator,
    normalized,
    message: "Operator terdeteksi ✓",
  };
}
