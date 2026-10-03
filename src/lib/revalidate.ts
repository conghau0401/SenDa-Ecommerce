import "server-only";
import { revalidatePath } from "next/cache";

/** Làm mới toàn bộ trang storefront đã cache sau khi admin thay đổi dữ liệu */
export function revalidateStore() {
  revalidatePath("/", "layout");
}
