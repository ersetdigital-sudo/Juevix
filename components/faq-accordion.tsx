"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faqs } from "@/data/faq";
import { cn } from "@/lib/cn";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-10 divide-y divide-line border-y border-line">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div key={faq.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold transition-colors hover:text-brand"
              >
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 text-xl leading-none text-brand transition-transform duration-200",
                    isOpen && "rotate-45",
                  )}
                >
                  +
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key={panelId}
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-muted">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
