import type { LegalDocument } from "@/data/legal";

interface LegalPageProps {
  document: LegalDocument;
}

export function LegalPage({ document }: LegalPageProps) {
  return (
    <main id="main" className="flex-1">
      <section className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-brand">
          Informasi
        </p>
        <h1 className="hd-tight mt-2 text-4xl font-extrabold">
          {document.title}
        </h1>
        <p className="mt-3 text-muted">{document.description}</p>
        <p className="mt-2 text-xs text-muted">
          Terakhir diperbarui: {document.updatedAt}
        </p>

        <div className="mt-10 space-y-8">
          {document.sections.map((section) => (
            <article key={section.heading}>
              <h2 className="font-display text-xl font-extrabold">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-muted">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
