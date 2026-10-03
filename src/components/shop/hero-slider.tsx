"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/lib/settings-schema";
import { cn } from "@/lib/utils";
import { buttonClass } from "../ui/button";

const INTERVAL = 6000;

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const count = banners.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count <= 1 || paused || reduceMotion) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, count, go, reduceMotion]);

  if (count === 0) return null;
  const b = banners[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Banner nổi bật"
      className="relative overflow-hidden rounded-[1.75rem] bg-leaf-900 shadow-lift"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/8]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${count}`}
          >
            <Image
              src={b.image}
              alt={b.title || "Banner"}
              fill
              priority={index === 0}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-leaf-900/85 via-leaf-900/35 to-transparent sm:bg-gradient-to-r sm:from-leaf-900/80 sm:via-leaf-900/40" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-end sm:items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="max-w-xl p-6 pb-14 text-white sm:p-12 lg:p-16"
            >
              {b.title && (
                <h1 className="text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                  {b.title}
                </h1>
              )}
              {b.subtitle && <p className="mt-3 text-base text-white/85 sm:mt-4 sm:text-lg">{b.subtitle}</p>}
              {b.ctaText && b.ctaLink && (
                <Link
                  href={b.ctaLink}
                  className={buttonClass({
                    size: "lg",
                    className: "mt-6 bg-white text-leaf-800 hover:bg-leaf-50 hover:text-leaf-900",
                  })}
                >
                  {b.ctaText}
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <>
            <div className="absolute right-6 bottom-5 hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => go(index - 1)}
                className="flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
                aria-label="Banner trước"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                className="flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
                aria-label="Banner tiếp theo"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
            <div className="absolute bottom-5 left-6 flex gap-2 sm:left-12 lg:left-16">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80",
                  )}
                  aria-label={`Chuyển đến banner ${i + 1}`}
                  aria-current={i === index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
