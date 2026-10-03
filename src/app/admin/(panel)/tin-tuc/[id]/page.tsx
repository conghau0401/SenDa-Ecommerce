import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { PostStatus } from "@/lib/constants";
import { PageHeader } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/post-form";

export const metadata: Metadata = { title: "Sửa bài viết" };

/** Date -> "2026-10-03T14:30" theo giờ VN cho input datetime-local */
function toVnLocalInput(d: Date | null): string {
  if (!d) return "";
  return new Date(d.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16);
}

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <PageHeader title="Sửa bài viết" back={{ href: "/admin/tin-tuc", label: "Tin tức" }} />
      <PostForm
        key={post.updatedAt.toISOString()}
        id={post.id}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          status: post.status as PostStatus,
          publishedAt: toVnLocalInput(post.publishedAt),
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
        }}
      />
    </>
  );
}
