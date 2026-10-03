"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProduct, toggleProductFlag } from "@/actions/admin/products";
import type { ProductFlag } from "@/lib/validators/admin";
import { buttonClass } from "../ui/button";
import { ToggleSwitch } from "./toggle-switch";
import { ConfirmButton } from "./confirm-button";

export function ProductFlagToggle({ id, flag, checked, label }: { id: number; flag: ProductFlag; checked: boolean; label: string }) {
  return <ToggleSwitch size="sm" checked={checked} label={label} action={(v) => toggleProductFlag(id, flag, v)} />;
}

/** Nút xóa sản phẩm: dạng icon trong bảng, dạng nút có chữ khi có redirectTo (trang sửa) */
export function DeleteProductButton({ id, name, redirectTo }: { id: number; name: string; redirectTo?: string }) {
  const router = useRouter();
  return (
    <ConfirmButton
      title={`Xóa sản phẩm "${name}"?`}
      description="Sản phẩm sẽ bị xóa vĩnh viễn. Các đơn hàng cũ vẫn giữ nguyên thông tin sản phẩm đã mua. Nếu chỉ muốn tạm ngừng bán, hãy tắt 'Hiển thị'."
      action={() => deleteProduct(id)}
      onDone={() => (redirectTo ? router.push(redirectTo) : router.refresh())}
      ariaLabel={redirectTo ? undefined : `Xóa ${name}`}
      className={
        redirectTo
          ? buttonClass({ variant: "outline", size: "sm", className: "border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50" })
          : "flex size-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
      }
    >
      <Trash2 className="size-4" aria-hidden />
      {redirectTo && "Xóa sản phẩm"}
    </ConfirmButton>
  );
}
