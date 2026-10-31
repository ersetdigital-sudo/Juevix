import { products as staticProducts, type Product } from "@/data/products";
import { services as staticServices, type Service } from "@/data/services";
import type { CatalogMethod, PublicCatalog } from "@/lib/db/server";

export type LinkInfo = {
  serviceId: string;
  productId?: string;
  bill?: boolean;
  inputKey: string;
};

export type PageLinks = {
  brandSlug: string;
  methodId: string;
  waCs: string | null;
  options: Record<string, LinkInfo>;
  bill?: LinkInfo;
};

export type ProductLinks = {
  brandSlug: string;
  methodId: string;
  waCs: string | null;
  options: Record<string, LinkInfo>;
};

const GROUP_SERVICES: Record<string, Record<string, string>> = {
  pln: {
    "Token Listrik": "pln",
    "Tagihan Pascabayar": "tagihan-pln",
  },
  pulsa: {
    "Pulsa Reguler": "pulsa",
    "Paket Data": "data",
  },
  "paket-data": {
    "Pilih Paket": "data",
  },
  bpjs: {
    "Bayar untuk": "bpjs",
  },
};

const PRODUCT_SERVICES: Record<string, string> = {
  "e-wallet": "ewallet",
  "internet-tv": "internet",
  multifinance: "multifinance",
};

function method(catalog: PublicCatalog): CatalogMethod | undefined {
  return catalog.methods[0];
}

function paymentBase(catalog: PublicCatalog) {
  return {
    brandSlug: catalog.brand.slug,
    methodId: method(catalog)?.id ?? "",
    waCs: catalog.brand.wa_cs,
  };
}

export function buildServicePage(slug: string, catalog: PublicCatalog) {
  const base = staticServices.find((service) => service.slug === slug);
  if (!base) return null;

  const bySlug = new Map(catalog.services.map((service) => [service.slug, service]));
  const baseLinks = paymentBase(catalog);
  const options: Record<string, LinkInfo> = {};

  const groups = base.groups.map((group) => {
    const mappedSlug = GROUP_SERVICES[slug]?.[group.label];
    const dbService = mappedSlug ? bySlug.get(mappedSlug) : undefined;
    if (!dbService) return group;
    const inputKey = dbService.inputs[0]?.key ?? "nomor_tujuan";
    const billGroup = dbService.jenis === "tagihan";

    return {
      ...group,
      options: group.options.map((option) => {
        const link: LinkInfo = {
          serviceId: dbService.dbId,
          bill: billGroup,
          inputKey,
        };

        if (billGroup) {
          options[`${group.label}::${option.name}`] = link;
          return { ...option, price: 0, note: option.note ?? "Cek tagihan" };
        }

        const product = dbService.products.find(
          (item) => item.nama === option.name,
        );
        if (!product) return option;
        link.productId = product.id;
        options[`${group.label}::${option.name}`] = link;
        return { ...option, price: product.hargaJual };
      }),
    };
  });

  let bill: LinkInfo | undefined;
  if (slug === "pdam") {
    const dbService = bySlug.get("pdam");
    if (dbService) {
      bill = {
        serviceId: dbService.dbId,
        bill: true,
        inputKey: dbService.inputs[0]?.key ?? "nomor_pelanggan",
      };
    }
  }

  return {
    service: { ...base, groups } as Service,
    links: { ...baseLinks, options, bill } satisfies PageLinks,
  };
}

export function buildHomeProducts(catalog: PublicCatalog) {
  const bySlug = new Map(catalog.services.map((service) => [service.slug, service]));
  const options: Record<string, LinkInfo> = {};

  const products = staticProducts.map((product) => {
    const serviceSlug = PRODUCT_SERVICES[product.id];
    const dbService = serviceSlug ? bySlug.get(serviceSlug) : undefined;
    if (!dbService) return product;

    const inputKey = dbService.inputs[0]?.key ?? "nomor_tujuan";
    const billProduct = dbService.jenis === "tagihan";

    return {
      ...product,
      options: product.options.map((option) => {
        const link: LinkInfo = {
          serviceId: dbService.dbId,
          bill: billProduct,
          inputKey,
        };
        if (!billProduct) {
          const dbProduct = dbService.products.find(
            (item) => item.nama === option.label,
          );
          if (!dbProduct) return option;
          link.productId = dbProduct.id;
          options[`${product.id}::${option.label}`] = link;
          return { ...option, price: dbProduct.hargaJual };
        }
        options[`${product.id}::${option.label}`] = link;
        return option;
      }),
    } satisfies Product;
  });

  return {
    products,
    links: { ...paymentBase(catalog), options } satisfies ProductLinks,
  };
}
