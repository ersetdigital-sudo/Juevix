"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navItems } from "@/data/nav";
import { cn } from "@/lib/cn";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("transition-transform duration-200", open && "rotate-180")}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setOpen(false);
    setMobileServicesOpen(false);
  };

  // Escape + kunci scroll saat drawer terbuka
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Dropdown "Layanan": tutup pakai Escape atau klik di luar
  useEffect(() => {
    if (!servicesOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        servicesButtonRef.current?.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [servicesOpen]);

  const isActive = (match?: string) => Boolean(match) && pathname === match;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center" aria-label="Juevix — beranda">
          <Image
            src="/images/brand/juevix-logo.png"
            alt="Juevix"
            width={1026}
            height={324}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex"
        >
          {navItems.map((item) => {
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.match) ? "page" : undefined}
                  className={cn(
                    "transition-colors hover:text-white",
                    isActive(item.match) && "text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            }

            const groupActive = item.children.some((child) =>
              isActive(child.match),
            );

            return (
              <div key={item.label} ref={servicesRef} className="relative">
                <button
                  ref={servicesButtonRef}
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls="nav-layanan"
                  onClick={() => setServicesOpen((value) => !value)}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors hover:text-white",
                    (servicesOpen || groupActive) && "text-white",
                  )}
                >
                  {item.label}
                  <Chevron open={servicesOpen} />
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.ul
                      id="nav-layanan"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-0 mt-3 w-60 rounded-2xl border border-line bg-panel p-2 shadow-2xl shadow-black/40"
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setServicesOpen(false)}
                            aria-current={isActive(child.match) ? "page" : undefined}
                            className={cn(
                              "block rounded-xl px-3 py-2.5 transition-colors hover:bg-bg hover:text-white",
                              isActive(child.match) && "bg-bg text-white",
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/#produk" className="btn !py-2.5 text-sm whitespace-nowrap">
            Bayar
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink transition-colors hover:border-brand md:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-bg md:hidden"
          >
            <nav aria-label="Navigasi mobile" className="mx-auto max-w-7xl px-5 py-4">
              <ul className="grid gap-1">
                {navItems.map((item) => {
                  if (!item.children) {
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          aria-current={isActive(item.match) ? "page" : undefined}
                          className={cn(
                            "block rounded-xl px-3 py-3 font-semibold text-muted transition-colors hover:bg-panel hover:text-white",
                            isActive(item.match) && "bg-panel text-white",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  const groupActive = item.children.some((child) =>
                    isActive(child.match),
                  );

                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        aria-expanded={mobileServicesOpen}
                        aria-controls="mobile-nav-layanan"
                        onClick={() => setMobileServicesOpen((value) => !value)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left font-semibold text-muted transition-colors hover:bg-panel hover:text-white",
                          (mobileServicesOpen || groupActive) && "text-white",
                        )}
                      >
                        {item.label}
                        <Chevron open={mobileServicesOpen} />
                      </button>

                      <AnimatePresence initial={false}>
                        {mobileServicesOpen && (
                          <motion.ul
                            id="mobile-nav-layanan"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={closeMenu}
                                  aria-current={
                                    isActive(child.match) ? "page" : undefined
                                  }
                                  className={cn(
                                    "block rounded-xl px-3 py-2.5 pl-6 text-sm font-semibold text-muted transition-colors hover:bg-panel hover:text-white",
                                    isActive(child.match) && "bg-panel text-white",
                                  )}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
