import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ name, logo, className }: { name: string; logo?: string; className?: string }) {
  return (
    <Link href="/" className={cn("flex shrink-0 items-center gap-2", className)} aria-label={`${name} – Trang chủ`}>
      {logo ? (
        <Image src={logo} alt={name} width={140} height={40} className="h-9 w-auto object-contain" priority />
      ) : (
        <>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
            <Leaf className="size-5" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight text-leaf-800">{name}</span>
        </>
      )}
    </Link>
  );
}
