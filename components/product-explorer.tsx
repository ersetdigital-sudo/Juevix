"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  productCategories,
  type Product,
  type ProductCategory,
  type ProductOption,
} from "@/data/products";
import type { ProductLinks } from "@/lib/commerce";
import { createBillCheck, createOrder } from "@/lib/db/client";
import { toPublicError } from "@/lib/db/errors";
import { digitsOnly, rupiah } from "@/lib/format";
import { saveRef } from "@/lib/refs";
import { cn } from "@/lib/cn";
import { SpriteIcon } from "./sprite-icon";

export function ProductExplorer({
  products,
  links,
}: {
  products: Product[];
  links: ProductLinks;
}) {
  const [category, setCategory] = useState<ProductCategory>("Semua");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Product | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const visibleProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchCategory = category === "Semua" || product.category === category;
      const matchKeyword =
        keyword === "" ||
        product.title.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword);

      return matchCategory && matchKeyword;
    });
  }, [products, category, query]);

  const closeDialog = useCallback(() => {
    setActive(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-brand">
            8 Kategori Layanan
          </p>
          <h2 className="hd-tight mt-2 text-4xl font-extrabold">
            Mau bayar apa hari ini?
          </h2>
        </div>

        <div className="w-full md:w-80">
          <label htmlFor="product-search" className="sr-only">
            Cari layanan
          </label>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari layanan, mis. PLN…"
            className="field"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 pb-2">
        {productCategories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            className={cn("tab", category === item && "is-active")}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 min-[520px]:grid-cols-3 min-[820px]:grid-cols-4">
        {visibleProducts.map((product) => {
          const tile = (
            <div
              className="tile relative"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 40%, ${product.accent}55, #1c1c26 70%)`,
              }}
            >
              <div className="tile-icon">
                <SpriteIcon index={product.sprite} />
              </div>
              {product.hot && (
                <span className="absolute left-2 top-2 rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                  HOT
                </span>
              )}
            </div>
          );

          const body = (
            <>
              {tile}
              <p className="mt-3 font-semibold leading-tight">{product.title}</p>
              <p className="mt-1 text-xs text-muted">{product.priceNote}</p>
            </>
          );

          return product.href ? (
            <Link
              key={product.id}
              href={product.href}
              className="prod panel block p-4"
              aria-label={`${product.title} — ${product.priceNote}`}
            >
              {body}
            </Link>
          ) : (
            <button
              key={product.id}
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActive(product);
              }}
              className="prod panel block p-4 text-left"
              aria-haspopup="dialog"
            >
              {body}
            </button>
          );
        })}

        {visibleProducts.length === 0 && (
          <p className="col-span-full text-muted">
            Layanan tidak ditemukan. Coba kata kunci lain ya.
          </p>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <ProductOrderDialog
            key={active.id}
            product={active}
            links={links}
            onClose={closeDialog}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface ProductOrderDialogProps {
  product: Product;
  links: ProductLinks;
  onClose: () => void;
}

function ProductOrderDialog({
  product,
  links,
  onClose,
}: ProductOrderDialogProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [option, setOption] = useState<ProductOption | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  // Fokus pindah ke dialog + kunci scroll body
  useEffect(() => {
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Escape untuk menutup + jebakan fokus sederhana
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const optionLink = option
    ? links.options[`${product.id}::${option.label}`]
    : undefined;
  const bill = Boolean(optionLink?.bill);
  const hasBill = product.options.some(
    (item) => links.options[`${product.id}::${item.label}`]?.bill,
  );
  const total = bill ? "Cek tagihan" : option ? rupiah(option.price) : "-";
  const inputId = "dialog-customer-id";

  async function handleContinue() {
    if (!customerId.trim() || !option) {
      setMessage({ ok: false, text: "Isi nomor dan pilih nominal dulu ya." });
      return;
    }
    if (!optionLink?.serviceId || !links.methodId) {
      setMessage({ ok: false, text: "Produk ini belum tersedia." });
      return;
    }

    setMessage(null);
    setPending(true);
    try {
      const input = { [optionLink.inputKey]: customerId.trim(), provider: option.label };
      let ref: string;
      if (optionLink.bill) {
        const wa = digitsOnly(whatsapp);
        if (wa.length < 9) {
          setMessage({ ok: false, text: "Isi nomor WhatsApp dulu ya." });
          setPending(false);
          return;
        }
        const created = await createBillCheck({
          brandSlug: links.brandSlug,
          serviceId: optionLink.serviceId,
          nomorTujuan: customerId.trim(),
          input,
          waPembeli: wa,
          paymentMethodId: links.methodId,
        });
        ref = created.ref;
      } else {
        if (!optionLink.productId) {
          setMessage({ ok: false, text: "Nominal ini belum tersedia." });
          setPending(false);
          return;
        }
        const created = await createOrder({
          brandSlug: links.brandSlug,
          serviceId: optionLink.serviceId,
          productId: optionLink.productId,
          nomorTujuan: customerId.trim(),
          input,
          paymentMethodId: links.methodId,
        });
        ref = created.ref;
      }
      saveRef(ref);
      router.push(`/bayar?ref=${encodeURIComponent(ref)}`);
    } catch (error) {
      setMessage({ ok: false, text: toPublicError(error).message });
      setPending(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="panel max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="product-dialog-title" className="font-display text-2xl font-extrabold">
            {product.title}
          </h3>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="text-2xl leading-none text-muted transition-colors hover:text-white"
          >
            ×
          </button>
        </div>

        <label htmlFor={inputId} className="mt-5 block text-sm text-muted">
          {product.category === "E-Wallet" ? "Nomor HP akun e-wallet" : "ID Pelanggan / Nomor HP"}
        </label>
        <input
          id={inputId}
          inputMode="numeric"
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          className="field mt-2"
          placeholder="Contoh: 532110987654"
        />

        {hasBill && (
          <div className="mt-5">
            <label htmlFor="dialog-wa" className="block text-sm text-muted">
              No. WhatsApp (untuk link bayar)
            </label>
            <input
              id="dialog-wa"
              inputMode="numeric"
              autoComplete="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              className="field mt-2"
              placeholder="0812xxxxxxxx"
            />
          </div>
        )}

        <p className="mt-5 text-sm text-muted">Pilih nominal</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {product.options.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={option?.label === item.label}
              onClick={() => {
                setOption(item);
                setMessage(null);
              }}
              className={cn("nom", option?.label === item.label && "is-active")}
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-brand">
                {links.options[`${product.id}::${item.label}`]?.bill
                  ? "Cek tagihan"
                  : rupiah(item.price)}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <span className="text-muted">Total</span>
          <span className="font-display text-2xl font-extrabold text-brand">{total}</span>
        </div>

        <button
          type="button"
          onClick={() => void handleContinue()}
          disabled={pending}
          className="btn mt-5 w-full justify-center"
        >
          {pending ? "Memproses…" : "Lanjut Bayar"}
        </button>

        <p
          aria-live="polite"
          className={cn("mt-3 text-center text-sm", message?.ok ? "text-green-400" : "text-red-400")}
        >
          {message?.text}
        </p>
      </motion.div>
    </motion.div>
  );
}
