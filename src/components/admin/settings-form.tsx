"use client";

import { startTransition as startT, useActionState, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { saveSettings } from "@/actions/admin/settings";
import { changePassword } from "@/actions/auth";
import { vietQrUrl, type Banner, type Settings, type SettingKey } from "@/lib/settings-schema";
import { formatVND } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { FormField, fieldAria, inputClass } from "../ui/form-field";
import { Card } from "./ui";
import { ImageUpload } from "./image-upload";

const TABS = [
  { key: "store", label: "Cửa hàng" },
  { key: "social", label: "Mạng xã hội" },
  { key: "bank", label: "Chuyển khoản" },
  { key: "shipping", label: "Giao hàng" },
  { key: "home", label: "Banner trang chủ" },
  { key: "account", label: "Tài khoản" },
] as const;

type Tab = (typeof TABS)[number]["key"];

/** Hook lưu 1 nhóm cài đặt */
function useSave<K extends SettingKey>(key: K) {
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const save = (value: Settings[K]) =>
    startTransition(async () => {
      const res = await saveSettings(key, value).catch(() => ({ ok: false as const, message: "Mất kết nối" }));
      if (res.ok) {
        toast.success(res.message ?? "Đã lưu");
        setErrors({});
      } else {
        toast.error(res.message);
        if ("errors" in res && res.errors) setErrors(res.errors);
      }
    });
  return { pending, errors, save };
}

function SaveBar({ pending }: { pending: boolean }) {
  return (
    <div className="flex justify-end border-t border-border pt-5">
      <Button type="submit" loading={pending}>
        {!pending && <Save className="size-4" aria-hidden />} Lưu thay đổi
      </Button>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  placeholder,
  textarea,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      {textarea ? (
        <textarea {...fieldAria(id, error)} value={value} onChange={(e) => onChange(e.target.value)} rows={2} placeholder={placeholder} className={inputClass} />
      ) : (
        <input {...fieldAria(id, error)} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
      )}
    </FormField>
  );
}

function StoreSection({ initial }: { initial: Settings["store"] }) {
  const [v, setV] = useState(initial);
  const { pending, errors, save } = useSave("store");
  const f = (k: keyof Settings["store"]) => (val: string) => setV((s) => ({ ...s, [k]: val }));
  return (
    <form onSubmit={(e) => (e.preventDefault(), save(v))} noValidate>
      <Card title="Thông tin cửa hàng">
        <div className="grid gap-5 md:grid-cols-[200px_1fr]">
          <div>
            <p className="mb-1.5 text-sm font-medium">Logo</p>
            <ImageUpload value={v.logo} onChange={f("logo")} aspect="aspect-[3/2]" label="Tải logo" />
            <p className="mt-1.5 text-xs text-muted">Để trống sẽ dùng biểu tượng lá + tên cửa hàng</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="s-name" label="Tên cửa hàng" value={v.name} onChange={f("name")} error={errors.name} />
            <TextField id="s-slogan" label="Slogan" value={v.slogan} onChange={f("slogan")} error={errors.slogan} />
            <TextField id="s-phone" label="Số điện thoại" value={v.phone} onChange={f("phone")} error={errors.phone} />
            <TextField id="s-email" label="Email" type="email" value={v.email} onChange={f("email")} error={errors.email} />
            <div className="sm:col-span-2">
              <TextField id="s-address" label="Địa chỉ" value={v.address} onChange={f("address")} error={errors.address} />
            </div>
            <div className="sm:col-span-2">
              <TextField id="s-hours" label="Giờ mở cửa" value={v.workingHours} onChange={f("workingHours")} error={errors.workingHours} />
            </div>
            <div className="sm:col-span-2">
              <TextField
                id="s-map"
                label="Google Maps (link nhúng)"
                value={v.mapEmbedUrl}
                onChange={f("mapEmbedUrl")}
                error={errors.mapEmbedUrl}
                hint="Google Maps → Chia sẻ → Nhúng bản đồ → sao chép HTML và dán vào đây (hệ thống tự lấy link)"
                textarea
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <SaveBar pending={pending} />
        </div>
      </Card>
    </form>
  );
}

function SocialSection({ initial }: { initial: Settings["social"] }) {
  const [v, setV] = useState(initial);
  const { pending, errors, save } = useSave("social");
  const fields: { k: keyof Settings["social"]; label: string; ph: string }[] = [
    { k: "facebook", label: "Facebook", ph: "https://facebook.com/tenshop" },
    { k: "instagram", label: "Instagram", ph: "https://instagram.com/tenshop" },
    { k: "tiktok", label: "TikTok", ph: "https://tiktok.com/@tenshop" },
    { k: "youtube", label: "YouTube", ph: "https://youtube.com/@tenshop" },
    { k: "zalo", label: "Zalo", ph: "https://zalo.me/0901234567" },
  ];
  return (
    <form onSubmit={(e) => (e.preventDefault(), save(v))} noValidate>
      <Card title="Mạng xã hội" description="Để trống mục nào thì mục đó không hiển thị ở footer">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ k, label, ph }) => (
            <TextField key={k} id={`so-${k}`} label={label} type="url" placeholder={ph} value={v[k]} onChange={(val) => setV((s) => ({ ...s, [k]: val }))} error={errors[k]} />
          ))}
        </div>
        <div className="mt-5">
          <SaveBar pending={pending} />
        </div>
      </Card>
    </form>
  );
}

function BankSection({ initial }: { initial: Settings["bank"] }) {
  const [v, setV] = useState(initial);
  const { pending, errors, save } = useSave("bank");
  const f = (k: keyof Settings["bank"]) => (val: string) => setV((s) => ({ ...s, [k]: val }));
  const preview = vietQrUrl(v, 150000, "SD-TEST");
  return (
    <form onSubmit={(e) => (e.preventDefault(), save(v))} noValidate>
      <Card title="Thông tin chuyển khoản" description="Hiển thị cho khách chọn thanh toán chuyển khoản. Để trống số tài khoản để tắt phương thức này.">
        <div className="grid gap-6 md:grid-cols-[1fr_200px]">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="b-bankId"
              label="Mã ngân hàng (VietQR)"
              value={v.bankId}
              onChange={(val) => f("bankId")(val.toUpperCase())}
              error={errors.bankId}
              hint="VD: VCB, MB, TCB, ACB, VPB, BIDV, ICB (VietinBank)"
            />
            <TextField id="b-bankName" label="Tên ngân hàng hiển thị" value={v.bankName} onChange={f("bankName")} error={errors.bankName} />
            <TextField id="b-acc" label="Số tài khoản" value={v.accountNumber} onChange={(val) => f("accountNumber")(val.replace(/\s/g, ""))} error={errors.accountNumber} />
            <TextField
              id="b-name"
              label="Chủ tài khoản"
              value={v.accountName}
              onChange={(val) => f("accountName")(val.toUpperCase())}
              error={errors.accountName}
              hint="Viết hoa không dấu, đúng như trên ngân hàng"
            />
          </div>
          <div className="text-center">
            <p className="mb-2 text-sm font-medium">Xem trước QR</p>
            {preview ? (
              <Image src={preview} alt="Xem trước mã QR chuyển khoản" width={200} height={200} unoptimized className="mx-auto rounded-xl bg-white p-1 shadow-soft" />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-xl bg-sand text-xs text-muted">Nhập mã NH & STK</div>
            )}
            <p className="mt-1.5 text-xs text-muted">Mẫu {formatVND(150000)}</p>
          </div>
        </div>
        <div className="mt-5">
          <SaveBar pending={pending} />
        </div>
      </Card>
    </form>
  );
}

function ShippingSection({ initial }: { initial: Settings["shipping"] }) {
  const [fee, setFee] = useState(String(initial.fee));
  const [threshold, setThreshold] = useState(String(initial.freeThreshold));
  const { pending, errors, save } = useSave("shipping");
  const digits = (s: string) => s.replace(/\D/g, "");
  return (
    <form onSubmit={(e) => (e.preventDefault(), save({ fee: Number(fee) || 0, freeThreshold: Number(threshold) || 0 }))} noValidate>
      <Card title="Phí giao hàng">
        <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
          <TextField
            id="sh-fee"
            label="Phí ship cố định (đ)"
            value={fee}
            onChange={(v) => setFee(digits(v))}
            error={errors.fee}
            hint={Number(fee) ? formatVND(Number(fee)) : "0 = miễn phí mọi đơn"}
          />
          <TextField
            id="sh-free"
            label="Miễn phí ship cho đơn từ (đ)"
            value={threshold}
            onChange={(v) => setThreshold(digits(v))}
            error={errors.freeThreshold}
            hint={Number(threshold) ? `Đơn từ ${formatVND(Number(threshold))} được miễn phí` : "0 = không áp dụng"}
          />
        </div>
        <div className="mt-5">
          <SaveBar pending={pending} />
        </div>
      </Card>
    </form>
  );
}

function BannersSection({ initial }: { initial: Settings["home"] }) {
  const [banners, setBanners] = useState<(Banner & { _k: string })[]>(() => initial.banners.map((b, i) => ({ ...b, _k: `b${i}` })));
  const { pending, errors, save } = useSave("home");
  const update = (i: number, patch: Partial<Banner>) => setBanners((list) => list.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const move = (i: number, d: -1 | 1) =>
    setBanners((list) => {
      const next = [...list];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = banners.findIndex((b) => !b.image);
    if (missing >= 0) {
      toast.error(`Banner ${missing + 1} chưa có ảnh`);
      return;
    }
    save({ banners: banners.map(({ _k, ...b }) => (void _k, b)) });
  };

  return (
    <form onSubmit={submit} noValidate>
      <Card
        title="Banner trang chủ"
        description="Tối đa 6 banner, tự chuyển sau 6 giây. Ảnh nên có tỉ lệ ngang ~21:8, tối thiểu 1600px."
        actions={
          banners.length < 6 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setBanners((l) => [...l, { _k: crypto.randomUUID(), image: "", title: "", subtitle: "", ctaText: "", ctaLink: "" }])}
            >
              <Plus className="size-4" aria-hidden /> Thêm banner
            </Button>
          )
        }
      >
        {banners.length === 0 && <p className="py-6 text-center text-sm text-muted">Chưa có banner. Trang chủ sẽ chỉ hiển thị tên cửa hàng.</p>}
        <ol className="space-y-5">
          {banners.map((b, i) => (
            <li key={b._k} className="rounded-xl border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Banner {i + 1}</p>
                <div className="flex gap-1">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="flex size-8 items-center justify-center rounded-lg hover:bg-sand disabled:opacity-30" aria-label={`Đưa banner ${i + 1} lên`}>
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={i === banners.length - 1}
                    onClick={() => move(i, 1)}
                    className="flex size-8 items-center justify-center rounded-lg hover:bg-sand disabled:opacity-30"
                    aria-label={`Đưa banner ${i + 1} xuống`}
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBanners((l) => l.filter((_, j) => j !== i))}
                    className="flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                    aria-label={`Xóa banner ${i + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_1fr]">
                <ImageUpload value={b.image} onChange={(image) => update(i, { image })} aspect="aspect-[21/9]" label="Ảnh banner" />
                <div className="space-y-3">
                  <TextField id={`bn-title-${i}`} label="Tiêu đề" value={b.title} onChange={(title) => update(i, { title })} error={errors[`banners.${i}.title`]} />
                  <TextField id={`bn-sub-${i}`} label="Mô tả" value={b.subtitle} onChange={(subtitle) => update(i, { subtitle })} textarea />
                  <div className="grid grid-cols-2 gap-3">
                    <TextField id={`bn-cta-${i}`} label="Chữ trên nút" value={b.ctaText} onChange={(ctaText) => update(i, { ctaText })} placeholder="Mua ngay" />
                    <TextField id={`bn-link-${i}`} label="Link nút" value={b.ctaLink} onChange={(ctaLink) => update(i, { ctaLink })} placeholder="/san-pham" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-5">
          <SaveBar pending={pending} />
        </div>
      </Card>
    </form>
  );
}

function AccountSection() {
  const [state, action, pending] = useActionState(changePassword, null);
  const errors = state && !state.ok ? state.errors : undefined;
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startT(() => action(data));
      }}
    >
      <Card title="Đổi mật khẩu" description="Nên đổi mật khẩu mặc định ngay sau khi cài đặt">
        {state?.ok && <p className="mb-4 rounded-xl bg-leaf-50 px-4 py-3 text-sm text-leaf-800" role="status">{state.message}</p>}
        {state && !state.ok && !errors && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.message}</p>}
        <div className="grid max-w-md gap-4">
          <FormField id="pw-current" label="Mật khẩu hiện tại" error={errors?.current}>
            <input {...fieldAria("pw-current", errors?.current)} name="current" type="password" autoComplete="current-password" className={inputClass} />
          </FormField>
          <FormField id="pw-next" label="Mật khẩu mới" error={errors?.next} hint="Tối thiểu 8 ký tự">
            <input {...fieldAria("pw-next", errors?.next)} name="next" type="password" autoComplete="new-password" className={inputClass} />
          </FormField>
          <FormField id="pw-confirm" label="Nhập lại mật khẩu mới" error={errors?.confirm}>
            <input {...fieldAria("pw-confirm", errors?.confirm)} name="confirm" type="password" autoComplete="new-password" className={inputClass} />
          </FormField>
        </div>
        <div className="mt-5">
          <SaveBar pending={pending} />
        </div>
      </Card>
    </form>
  );
}

export function SettingsForm({ initial }: { initial: Settings }) {
  const [tab, setTab] = useState<Tab>("store");
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[200px_1fr]">
      <nav aria-label="Nhóm cài đặt" className="-mx-4 overflow-x-auto px-4 lg:sticky lg:top-6 lg:mx-0 lg:px-0">
        <ul className="flex gap-1 lg:flex-col">
          {TABS.map((t) => (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => setTab(t.key)}
                aria-current={tab === t.key ? "page" : undefined}
                className={cn(
                  "w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-colors",
                  tab === t.key ? "bg-surface text-leaf-800 shadow-soft ring-1 ring-border/70" : "text-muted hover:bg-surface/60 hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0">
        {/* Giữ các form đã mount để không mất dữ liệu đang sửa khi đổi tab */}
        <div hidden={tab !== "store"}><StoreSection initial={initial.store} /></div>
        <div hidden={tab !== "social"}><SocialSection initial={initial.social} /></div>
        <div hidden={tab !== "bank"}><BankSection initial={initial.bank} /></div>
        <div hidden={tab !== "shipping"}><ShippingSection initial={initial.shipping} /></div>
        <div hidden={tab !== "home"}><BannersSection initial={initial.home} /></div>
        <div hidden={tab !== "account"}><AccountSection /></div>
      </div>
    </div>
  );
}
