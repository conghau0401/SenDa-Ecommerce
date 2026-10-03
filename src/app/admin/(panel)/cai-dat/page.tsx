import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Cài đặt" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader title="Cài đặt cửa hàng" description="Thay đổi được áp dụng ngay trên website" />
      <SettingsForm initial={settings} />
    </>
  );
}
