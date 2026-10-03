import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { getLatestPosts, getPostBySlug } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/format";
import { htmlToText, sanitizeHtml } from "@/lib/sanitize";
import { SITE_URL } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { PostCard } from "@/components/shop/post-card";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Không tìm thấy bài viết" };
  const description = post.metaDescription || post.excerpt || htmlToText(post.content);
  return {
    title: post.metaTitle || post.title,
    description,
    alternates: { canonical: `/tin-tuc/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle || post.title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [related, { store }] = await Promise.all([getLatestPosts(3, post.id), getSettings()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ? `${SITE_URL}${post.coverImage}` : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    publisher: { "@type": "Organization", name: store.name },
    mainEntityOfPage: `${SITE_URL}/tin-tuc/${post.slug}`,
  };

  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Tin tức", href: "/tin-tuc" }, { label: post.title }]} />
        <article className="mt-6">
          <header>
            <h1 className="text-3xl leading-tight font-bold tracking-tight text-balance text-leaf-900 sm:text-4xl lg:text-[2.75rem]">
              {post.title}
            </h1>
            {post.publishedAt && (
              <p className="mt-4 flex items-center gap-1.5 text-sm text-muted">
                <CalendarDays className="size-4" aria-hidden />
                Đăng ngày <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
              </p>
            )}
            {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-foreground/80">{post.excerpt}</p>}
          </header>
          {post.coverImage && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-sand shadow-soft">
              <Image src={post.coverImage} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>
          )}
          <div className="prose-content mt-10" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
        </article>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-[1.5rem] bg-leaf-50 p-8 text-center">
          <p className="text-lg font-semibold text-leaf-900">Sẵn sàng bắt đầu khu vườn sen đá của bạn?</p>
          <ButtonLink href="/san-pham">Khám phá sản phẩm</ButtonLink>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 sm:mt-24">
          <SectionHeading title="Bài viết khác" href="/tin-tuc" />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
