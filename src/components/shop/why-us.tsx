import { HeartHandshake, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { formatVND } from "@/lib/format";
import { SectionHeading } from "../ui/section-heading";
import { Reveal } from "./reveal";

export function WhyUs({ freeThreshold }: { freeThreshold: number }) {
  const items = [
    {
      Icon: ShieldCheck,
      title: "Cây khỏe, tuyển chọn kỹ",
      text: "Mỗi chậu đều được thuần khí hậu và kiểm tra kỹ trước khi giao đến bạn.",
    },
    {
      Icon: PackageCheck,
      title: "Đóng gói an toàn",
      text: "Đóng hộp chống sốc, cố định gốc – cây đến tay vẫn nguyên vẹn như ở vườn.",
    },
    {
      Icon: Truck,
      title: "Giao hàng toàn quốc",
      text:
        freeThreshold > 0
          ? `Miễn phí giao hàng cho đơn từ ${formatVND(freeThreshold)}. Nội thành nhận trong 24h.`
          : "Giao nhanh nội thành trong 24h, toàn quốc 2–4 ngày.",
    },
    {
      Icon: HeartHandshake,
      title: "Bảo hành 7 ngày",
      text: "Cây gặp vấn đề khi nhận? Shop đổi mới miễn phí và tư vấn chăm sóc trọn đời.",
    },
  ];

  return (
    <section className="rounded-[1.75rem] bg-leaf-50 px-5 py-12 sm:px-10 sm:py-16">
      <SectionHeading
        align="center"
        eyebrow="Vì sao chọn chúng tôi"
        title="Gieo niềm vui xanh vào từng góc nhỏ"
        description="Hơn cả một cửa hàng cây, chúng tôi đồng hành cùng bạn chăm sóc từng chậu sen đá."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.08}>
            <div className="h-full rounded-card bg-surface p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/60 text-leaf-800">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold text-leaf-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
