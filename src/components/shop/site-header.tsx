import { getSettings } from "@/lib/settings";
import { getActiveCategories } from "@/lib/queries";
import { formatVND } from "@/lib/format";
import { HeaderClient } from "./header-client";

export async function SiteHeader() {
  const [{ store, shipping }, categories] = await Promise.all([getSettings(), getActiveCategories()]);
  const announcement =
    shipping.freeThreshold > 0
      ? `🌿 Miễn phí giao hàng cho đơn từ ${formatVND(shipping.freeThreshold)}`
      : "🌿 Cây khỏe – đóng gói cẩn thận – giao tận nơi";

  return (
    <HeaderClient
      storeName={store.name}
      logo={store.logo}
      phone={store.phone}
      announcement={announcement}
      categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
    />
  );
}
