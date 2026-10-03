import Image from "next/image";
import { Landmark } from "lucide-react";
import { vietQrUrl, type Settings } from "@/lib/settings-schema";
import { formatVND } from "@/lib/format";
import { CopyButton } from "../ui/copy-button";

/** Thông tin chuyển khoản + mã VietQR (đã điền sẵn số tiền & nội dung = mã đơn) */
export function BankTransferInfo({ bank, amount, code }: { bank: Settings["bank"]; amount: number; code: string }) {
  if (!bank.accountNumber) {
    return (
      <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
        Shop sẽ liên hệ để gửi thông tin chuyển khoản cho bạn.
      </p>
    );
  }
  const qr = vietQrUrl(bank, amount, code);
  const rows = [
    { label: "Ngân hàng", value: bank.bankName || bank.bankId },
    { label: "Số tài khoản", value: bank.accountNumber, copy: true },
    { label: "Chủ tài khoản", value: bank.accountName },
    { label: "Số tiền", value: formatVND(amount), copyValue: String(amount), copy: true },
    { label: "Nội dung CK", value: code, copy: true, highlight: true },
  ];
  return (
    <div className="rounded-[1.5rem] border border-leaf-200 bg-leaf-50/60 p-5 sm:p-6">
      <h3 className="flex items-center gap-2 font-semibold text-leaf-900">
        <Landmark className="size-5 text-leaf-700" aria-hidden />
        Thông tin chuyển khoản
      </h3>
      <div className="mt-4 grid items-center gap-5 sm:grid-cols-[180px_1fr]">
        {qr && (
          <div className="mx-auto w-[180px] overflow-hidden rounded-2xl bg-white p-2 shadow-soft">
            <Image
              src={qr}
              alt={`Mã QR chuyển khoản ${formatVND(amount)} cho đơn ${code}`}
              width={180}
              height={180}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        )}
        <dl className="space-y-2 text-sm">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3">
              <dt className="text-muted">{r.label}</dt>
              <dd className="flex items-center gap-1.5 text-right font-semibold">
                <span className={r.highlight ? "rounded-md bg-accent/60 px-2 py-0.5 text-leaf-900" : undefined}>{r.value}</span>
                {r.copy && <CopyButton value={r.copyValue ?? r.value} label={r.label} />}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-4 text-xs text-muted">
        Quét mã QR bằng app ngân hàng để tự điền đúng số tiền và nội dung. Đơn sẽ được xác nhận sau khi shop nhận được thanh toán.
      </p>
    </div>
  );
}
