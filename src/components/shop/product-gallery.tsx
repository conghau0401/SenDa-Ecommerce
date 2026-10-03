"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImage = { url: string; alt: string | null };

export function ProductGallery({ images, name, badges }: { images: GalleryImage[]; name: string; badges?: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const count = images.length;

  const go = (next: number) => {
    if (count <= 1) return;
    setDirection(next > index ? 1 : -1);
    setIndex(((next % count) + count) % count);
  };

  if (count === 0) {
    return <div className="aspect-square rounded-[1.5rem] bg-sand" aria-label="Chưa có ảnh" />;
  }

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-sand shadow-soft"
        data-fly-image
        aria-roledescription="carousel"
        aria-label={`Ảnh sản phẩm ${name}`}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            className={cn("absolute inset-0 touch-pan-y", count > 1 && "cursor-grab active:cursor-grabbing")}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1);
              else if (info.offset.x > 60) go(index - 1);
            }}
          >
            <Image
              src={images[index].url}
              alt={images[index].alt || `${name} – ảnh ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="pointer-events-none object-cover select-none"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {badges && <div className="pointer-events-none absolute top-4 left-4 flex flex-col items-start gap-1.5">{badges}</div>}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-leaf-900 shadow-soft backdrop-blur transition hover:bg-white sm:flex"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-leaf-900 shadow-soft backdrop-blur transition hover:bg-white sm:flex"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute right-0 bottom-3 left-0 flex justify-center gap-1.5 sm:hidden" aria-hidden>
              {images.map((_, i) => (
                <span key={i} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-white" : "w-1.5 bg-white/60")} />
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              Ảnh {index + 1} trên {count}
            </p>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => go(i)}
              className={cn(
                "relative aspect-square w-[72px] shrink-0 overflow-hidden rounded-xl ring-2 transition-all sm:w-20",
                i === index ? "ring-leaf-600" : "opacity-70 ring-transparent hover:opacity-100",
              )}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === index}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
