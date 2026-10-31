import Link from "next/link";

export function DataUnavailable({
  message = "Layanan lagi gangguan, coba lagi sebentar.",
}: {
  message?: string;
}) {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-2xl px-5 py-20">
        <div className="panel p-8 text-center">
          <p className="text-4xl">⚠️</p>
          <h1 className="hd-tight mt-3 text-2xl font-extrabold">
            Belum bisa dimuat
          </h1>
          <p className="mt-2 text-sm text-muted">{message}</p>
          <Link href="/" className="btn mt-6">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
