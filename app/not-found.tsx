import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center px-5 py-24">
      <div className="panel max-w-lg p-10 text-center">
        <p className="font-display text-6xl font-extrabold text-brand">404</p>
        <h1 className="hd-tight mt-4 text-3xl font-extrabold">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-3 text-muted">
          Tautan yang kamu buka mungkin sudah dipindahkan atau salah ketik.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn">
            Kembali ke Beranda
          </Link>
          <Link href="/#produk" className="ghost">
            Lihat Layanan
          </Link>
        </div>
      </div>
    </main>
  );
}
