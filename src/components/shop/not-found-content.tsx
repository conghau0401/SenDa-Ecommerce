import { Sprout } from "lucide-react";
import { ButtonLink } from "../ui/button";

export function NotFoundContent() {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
      <div className="flex size-20 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
        <Sprout className="size-10" aria-hidden />
      </div>
      <p className="mt-6 text-sm font-semibold tracking-widest text-leaf-600">LỖI 404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-leaf-900 sm:text-4xl">Ôi, chậu cây này không tồn tại</h1>
      <p className="mt-3 max-w-md text-muted">
        Trang bạn tìm có thể đã bị di chuyển hoặc không còn nữa. Cùng quay lại vườn cây nhé!
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Về trang chủ</ButtonLink>
        <ButtonLink href="/san-pham" variant="outline">
          Xem sản phẩm
        </ButtonLink>
      </div>
    </div>
  );
}
