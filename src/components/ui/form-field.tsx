import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[15px] transition-colors outline-none placeholder:text-muted/60 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-red-100";

/** Label + ô nhập + thông báo lỗi, gắn aria đầy đủ */
export function FormField({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Thuộc tính aria cho ô nhập theo trạng thái lỗi */
export function fieldAria(id: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}
