"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Service, ServiceOption } from "@/data/services";
import type { PageLinks } from "@/lib/commerce";
import { createBillCheck, createOrder } from "@/lib/db/client";
import { toPublicError } from "@/lib/db/errors";
import { digitsOnly, rupiah } from "@/lib/format";
import { detectOperator } from "@/lib/operators";
import { saveRef } from "@/lib/refs";
import { cn } from "@/lib/cn";

interface ServiceOrderFormProps {
  service: Service;
  links: PageLinks;
}

export function ServiceOrderForm({ service, links }: ServiceOrderFormProps) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [option, setOption] = useState<ServiceOption | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [region, setRegion] = useState(service.regionSelect?.options[0] ?? "");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [pending, setPending] = useState(false);

  const digits = digitsOnly(customerId);
  const productName = service.regionSelect ? region : (option?.name ?? "");
  const detection = useMemo(
    () => (service.detectOperator ? detectOperator(customerId) : null),
    [customerId, service.detectOperator],
  );

  const optionLink = option
    ? links.options[`${selectedGroup ?? ""}::${option.name}`]
    : undefined;
  const bill = Boolean(links.bill || optionLink?.bill);
  const hasBill = Boolean(
    links.bill || Object.values(links.options).some((item) => item.bill),
  );
  const total = bill ? 0 : (option?.price ?? 0);
  const totalLabel = bill
    ? "Cek tagihan"
    : option
      ? rupiah(total)
      : "Pilih produk dulu";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!customerId.trim() || !productName) {
      setIsError(true);
      setMessage("Isi nomor dan pilih produk dulu ya.");
      return;
    }

    if (service.detectOperator && detection?.status === "unknown") {
      setIsError(true);
      setMessage("Nomor tidak dikenali. Cek kembali nomor HP kamu ya.");
      return;
    }

    const link = links.bill ?? optionLink;
    if (!link?.serviceId) {
      setIsError(true);
      setMessage("Produk ini belum tersedia. Coba pilih produk lain.");
      return;
    }
    if (!links.methodId) {
      setIsError(true);
      setMessage("Metode pembayaran belum tersedia.");
      return;
    }

    setIsError(false);
    setMessage("");
    setPending(true);

    try {
      const baseInput: Record<string, string> = {
        [link.inputKey]: customerId.trim(),
      };
      if (service.regionSelect) baseInput.wilayah = region;
      if (option) baseInput.durasi = option.name;

      let ref: string;
      if (link.bill) {
        const wa = digitsOnly(whatsapp);
        if (wa.length < 9) {
          setIsError(true);
          setMessage("Isi nomor WhatsApp dulu ya (minimal 9 angka).");
          setPending(false);
          return;
        }
        const created = await createBillCheck({
          brandSlug: links.brandSlug,
          serviceId: link.serviceId,
          nomorTujuan: customerId.trim(),
          input: baseInput,
          waPembeli: wa,
          paymentMethodId: links.methodId,
        });
        ref = created.ref;
      } else {
        if (!link.productId) {
          setIsError(true);
          setMessage("Produk ini belum tersedia. Coba pilih produk lain.");
          setPending(false);
          return;
        }
        const created = await createOrder({
          brandSlug: links.brandSlug,
          serviceId: link.serviceId,
          productId: link.productId,
          nomorTujuan: customerId.trim(),
          input: baseInput,
          paymentMethodId: links.methodId,
        });
        ref = created.ref;
      }

      saveRef(ref);
      router.push(`/bayar?ref=${encodeURIComponent(ref)}`);
    } catch (error) {
      setIsError(true);
      setMessage(toPublicError(error).message);
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid max-w-7xl gap-6 px-5 py-14 lg:grid-cols-3"
    >
      <div className="panel min-w-0 p-7 lg:col-span-2">
        <label htmlFor="customer-id" className="text-sm font-semibold">
          {service.input.label}
        </label>
        <input
          id="customer-id"
          name="customerId"
          inputMode={service.input.inputMode}
          autoComplete="off"
          value={customerId}
          onChange={(event) => {
            setCustomerId(event.target.value);
            setMessage("");
          }}
          className="field mt-3"
          placeholder={service.input.placeholder}
          aria-describedby={detection ? "operator-status" : undefined}
        />

        {detection && detection.status !== "empty" && (
          <div
            id="operator-status"
            aria-live="polite"
            className="mt-2 flex items-center gap-2 text-sm"
          >
            {detection.operator?.logo ? (
              <span className="inline-flex h-8 items-center rounded-lg bg-white px-2.5">
                <Image
                  src={detection.operator.logo.src}
                  alt={detection.operator.name}
                  width={detection.operator.logo.width}
                  height={detection.operator.logo.height}
                  className="h-5 w-auto max-w-[96px] object-contain"
                />
              </span>
            ) : (
              <span
                className="rounded-md px-2 py-0.5 text-xs font-extrabold text-white"
                style={{ background: detection.operator?.color ?? "#3a3a46" }}
              >
                {detection.operator?.name ?? "?"}
              </span>
            )}
            <span className="text-muted">{detection.message}</span>
          </div>
        )}

        {hasBill && (
          <div className="mt-5">
            <label htmlFor="order-wa" className="text-sm font-semibold">
              No. WhatsApp (untuk link bayar)
            </label>
            <input
              id="order-wa"
              name="whatsapp"
              inputMode="numeric"
              autoComplete="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              className="field mt-3"
              placeholder="0812xxxxxxxx"
            />
            <p className="mt-2 text-xs text-muted">
              Nominal dan link pembayaran dikirim admin ke WhatsApp ini.
            </p>
          </div>
        )}

        {service.groups.map((group) => (
          <fieldset key={group.label} className="mt-6">
            <legend className="text-sm font-semibold">{group.label}</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {group.options.map((item) => {
                const isSelected =
                  selectedGroup === group.label && option?.name === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setOption(item);
                      setSelectedGroup(group.label);
                      setMessage("");
                    }}
                    className={cn("nom", isSelected && "is-active")}
                  >
                    <p className="text-sm font-semibold">
                      {item.caption ?? item.name}
                    </p>
                    <p className="text-xs text-brand">
                      {item.note ?? rupiah(item.price)}
                    </p>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        {service.regionSelect && (
          <div className="mt-6">
            <label htmlFor="region" className="text-sm font-semibold">
              {service.regionSelect.label}
            </label>
            <select
              id="region"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="field mt-3"
            >
              {service.regionSelect.options.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <aside className="panel h-fit min-w-0 p-7 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-extrabold">Ringkasan</h2>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Layanan</dt>
            <dd className="text-right">{service.title}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Nomor</dt>
            <dd id="summary-number" className="break-all text-right">
              {customerId || "-"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Produk</dt>
            <dd className="text-right">{productName || "-"}</dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
          <span className="text-muted">Total</span>
          <span className="font-display text-2xl font-extrabold text-brand">
            {totalLabel}
          </span>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn mt-5 w-full justify-center"
        >
          {pending ? "Memproses…" : "Lanjut Bayar"}
        </button>

        <p
          aria-live="polite"
          className={cn(
            "mt-3 text-center text-sm",
            isError ? "text-red-400" : "text-muted",
          )}
        >
          {message}
        </p>

        <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-muted">
          {service.notes.map((note) => (
            <li key={note} className="flex gap-3">
              <span aria-hidden="true" className="text-brand">
                ✓
              </span>
              {note}
            </li>
          ))}
        </ul>
      </aside>
    </form>
  );
}
