import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { AdminShell } from "@/components/admin/admin-shell";

// Trang quản trị luôn đọc dữ liệu mới nhất
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [{ store }, newOrders, openContacts, chatToReview] = await Promise.all([
    getSettings(),
    prisma.order.count({ where: { status: "NEW" } }),
    prisma.contact.count({ where: { isHandled: false } }),
    prisma.chatConversation.count({ where: { isReviewed: false } }),
  ]);

  return (
    <AdminShell storeName={store.name} admin={admin} badges={{ orders: newOrders, contacts: openContacts, chatbot: chatToReview }}>
      {children}
    </AdminShell>
  );
}
