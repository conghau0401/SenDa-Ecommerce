"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const START_EVENT = "senda:navstart";
/** Chỉ hiện thanh khi chuyển trang lâu hơn ngưỡng này – tránh nháy với trang tải nhanh */
const SHOW_DELAY = 120;
/** Phòng trường hợp điều hướng lỗi/bị hủy: tự ẩn sau thời gian này */
const SAFETY_TIMEOUT = 12_000;

/** Gọi trước router.push(...) để hiện thanh tiến trình cho điều hướng bằng code */
export function startNavigationProgress() {
  window.dispatchEvent(new Event(START_EVENT));
}

function isNavigatingLink(e: MouseEvent): boolean {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a || a.target === "_blank" || a.hasAttribute("download")) return false;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return false;
  // Cùng trang (hoặc chỉ khác #hash) -> không có điều hướng
  return url.pathname + url.search !== location.pathname + location.search;
}

function Bar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const showTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const safetyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pending = useRef(false);

  useEffect(() => {
    const start = () => {
      pending.current = true;
      clearTimeout(showTimer.current);
      clearTimeout(safetyTimer.current);
      showTimer.current = setTimeout(() => pending.current && setPhase("loading"), SHOW_DELAY);
      safetyTimer.current = setTimeout(() => {
        pending.current = false;
        setPhase("idle");
      }, SAFETY_TIMEOUT);
    };
    const onClick = (e: MouseEvent) => isNavigatingLink(e) && start();
    document.addEventListener("click", onClick, true);
    window.addEventListener(START_EVENT, start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(START_EVENT, start);
    };
  }, []);

  // URL đã đổi -> điều hướng xong
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    clearTimeout(showTimer.current);
    clearTimeout(safetyTimer.current);
    setPhase((p) => (p === "loading" ? "done" : "idle"));
  }, [pathname, searchParams]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => setPhase("idle"), 400);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "idle") return null;
  return (
    <div
      role="progressbar"
      aria-label="Đang tải trang"
      aria-busy={phase === "loading"}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]"
    >
      <div
        className={
          phase === "loading"
            ? "h-full origin-left animate-[nav-progress_8s_cubic-bezier(0.1,0.7,0.2,1)_forwards] rounded-r-full bg-gradient-to-r from-leaf-400 to-accent shadow-[0_0_10px_var(--leaf-300)]"
            : "h-full w-full bg-gradient-to-r from-leaf-400 to-accent opacity-0 transition-opacity delay-150 duration-200"
        }
      />
    </div>
  );
}

/** Thanh tiến trình mảnh ở mép trên màn hình khi chuyển trang */
export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
