import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { PageHeader, tableCls } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tin tức" };

export default async function AdminPostsPage() {
  const now = new Date();
  const posts = await prisma.post.findMany({
    orderBy: [{ publishedAt: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }],
    select: { id: true, title: true, slug: true, status: true, publishedAt: true, updatedAt: true, coverImage: true },
  });

  return (
    <>
      <PageHeader
        title="Tin tức"
        description={`${posts.length} bài viết`}
        actions={
          <ButtonLink href="/admin/tin-tuc/moi">
            <Plus className="size-4" aria-hidden /> Viết bài mới
          </ButtonLink>
        }
      />
      {posts.length === 0 ? (
        <EmptyState title="Chưa có bài viết" />
      ) : (
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                <th className={tableCls.th}>Bài viết</th>
                <th className={tableCls.th}>Trạng thái</th>
                <th className={tableCls.th}>Ngày đăng</th>
                <th className={tableCls.th}>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                const scheduled = p.status === "PUBLISHED" && p.publishedAt && p.publishedAt > now;
                return (
                  <tr key={p.id} className={cn(tableCls.tr, "relative")}>
                    <td className={tableCls.td}>
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-sand">
                          {p.coverImage && <Image src={p.coverImage} alt="" fill sizes="64px" className="object-cover" />}
                        </div>
                        <Link href={`/admin/tin-tuc/${p.id}`} className="line-clamp-2 font-medium after:absolute after:inset-0 hover:text-leaf-700">
                          {p.title}
                        </Link>
                      </div>
                    </td>
                    <td className={tableCls.td}>
                      {p.status === "DRAFT" ? <Badge tone="gray">Nháp</Badge> : scheduled ? <Badge tone="blue">Hẹn giờ</Badge> : <Badge>Đã đăng</Badge>}
                    </td>
                    <td className={`${tableCls.td} whitespace-nowrap text-muted`}>{p.publishedAt ? formatDateTime(p.publishedAt) : "—"}</td>
                    <td className={`${tableCls.td} whitespace-nowrap text-muted`}>{formatDateTime(p.updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
