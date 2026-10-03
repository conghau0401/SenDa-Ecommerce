"use client";

import { useState } from "react";
import { formatVND } from "@/lib/format";
import { cn } from "@/lib/utils";

export type DailyPoint = { key: string; label: string; weekday: string; value: number; orders: number };

/** 1250000 -> "1,3tr", 250000 -> "250k" */
function compactVND(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}tr`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

/** Mốc trục Y tròn số: 0, step, 2·step... */
function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0];
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
}

/** Biểu đồ cột doanh số theo ngày (1 chuỗi – không cần legend, tiêu đề đã nói rõ) */
export function RevenueChart({ data }: { data: DailyPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 0);
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1] || 1;
  const peak = data.reduce((best, d, i) => (d.value > (data[best]?.value ?? -1) ? i : best), 0);
  const H = 200;

  return (
    <div>
      <div className="relative flex gap-3" style={{ height: H + 28 }}>
        {/* Trục Y */}
        <div className="relative w-10 shrink-0 text-right text-[11px] text-muted tabular-nums" style={{ height: H }} aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: H - (t / top) * H }}>
              {compactVND(t)}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* Gridline mảnh, liền */}
          {ticks.map((t) => (
            <div key={t} className="absolute inset-x-0 h-px bg-border/80" style={{ top: H - (t / top) * H }} aria-hidden />
          ))}

          <ul className="absolute inset-x-0 top-0 flex items-end" style={{ height: H }} aria-hidden>
            {data.map((d, i) => {
              const h = d.value > 0 ? Math.max(3, (d.value / top) * H) : 0;
              return (
                <li
                  key={d.key}
                  className="relative flex h-full flex-1 cursor-default items-end justify-center"
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                >
                  {/* Nhãn trực tiếp: chỉ cột cao nhất */}
                  {i === peak && d.value > 0 && active === null && (
                    <span className="absolute text-[11px] font-semibold whitespace-nowrap text-foreground" style={{ bottom: h + 4 }}>
                      {compactVND(d.value)}
                    </span>
                  )}
                  <div
                    className={cn(
                      "w-full max-w-6 rounded-t-[4px] transition-colors duration-150",
                      active === i ? "bg-leaf-500" : "bg-leaf-600",
                    )}
                    style={{ height: h }}
                  />
                </li>
              );
            })}
          </ul>

          {/* Nhãn trục X */}
          <div className="absolute inset-x-0 flex text-[11px] text-muted" style={{ top: H + 8 }} aria-hidden>
            {data.map((d, i) => (
              <span key={d.key} className={cn("flex-1 text-center", i % 2 === 1 && "max-sm:invisible")}>
                {d.label}
              </span>
            ))}
          </div>

          {/* Tooltip */}
          {active !== null && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl bg-leaf-900 px-3 py-2 text-xs whitespace-nowrap text-white shadow-lift"
              style={{
                left: `${((active + 0.5) / data.length) * 100}%`,
                bottom: H - Math.max(3, (data[active].value / top) * H) + 36,
              }}
              role="status"
            >
              <p className="text-sm font-bold">{formatVND(data[active].value)}</p>
              <p className="text-white/70">
                {data[active].weekday}, {data[active].label} · {data[active].orders} đơn
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Truy cập bằng bàn phím: mỗi ngày là 1 nút focus được, hiện tooltip giống hover */}
      <div className="sr-only">
        {data.map((d, i) => (
          <button key={d.key} type="button" onFocus={() => setActive(i)} onBlur={() => setActive(null)}>
            {d.weekday} {d.label}: {formatVND(d.value)}, {d.orders} đơn
          </button>
        ))}
      </div>

      {/* Bảng dữ liệu (thay thế cho biểu đồ) */}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-xs font-medium text-leaf-700 hover:underline">Xem dạng bảng</summary>
        <table className="mt-2 w-full text-xs">
          <thead>
            <tr className="text-left text-muted">
              <th className="py-1 font-medium">Ngày</th>
              <th className="py-1 text-right font-medium">Số đơn</th>
              <th className="py-1 text-right font-medium">Doanh số</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.key} className="border-t border-border">
                <td className="py-1">
                  {d.weekday}, {d.label}
                </td>
                <td className="py-1 text-right tabular-nums">{d.orders}</td>
                <td className="py-1 text-right tabular-nums">{formatVND(d.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
