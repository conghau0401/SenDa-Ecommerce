import { cn } from "@/lib/utils";

const tones = {
  green: "bg-leaf-100 text-leaf-800",
  mint: "bg-accent text-leaf-900",
  sale: "bg-sale text-white",
  gray: "bg-sand text-muted",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
  blue: "bg-sky-100 text-sky-800",
  dark: "bg-leaf-800 text-white",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  tone = "green",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}
    >
      {children}
    </span>
  );
}
