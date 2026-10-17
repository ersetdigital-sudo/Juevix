"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Jeda animasi dalam detik. */
  delay?: number;
  /** Jarak geser vertikal saat masuk viewport. */
  distance?: number;
}

/** Wrapper animasi fade + slide-up saat elemen masuk viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
