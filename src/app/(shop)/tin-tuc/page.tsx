import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { getPosts } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { PostCard } from "@/components/shop/post-card";

export const metadata: Metadata = {
  title: "Tin tức & kiến thức chăm sen đá",
  description: "Mẹo chăm sóc, nhân giống, bày trí sen đá và xương rồng từ những người làm vườn.",
  alternates: { canonical: "/tin-tuc" },
};

type Props = { searchParams: Promise<{ trang?: string }> };

export default async function PostsPage({ searchParams }: Props) {
  const page = Math.max(1, Number.parseInt((await searchParams).trang ?? "1", 10) || 1);
  const { items, totalPages } = await getPosts(page);
  // Trang 1: bài mới nhất hiển thị nổi bật
  const [featured, ...rest] = page === 1 ? items : [undefined, ...items];

  return (
    <div className="container-page py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Tin tức" }]} />
      <header className="mt-4 mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-leaf-900 sm:text-4xl">Góc chăm cây</h1>
        <p className="mt-2 text-muted">
          Kiến thức chăm sóc sen đá, xương rồng và terrarium – để mỗi chậu cây của bạn luôn khỏe đẹp.
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState title="Chưa có bài viết nào" description="Quay lại sau để đọc những bài viết mới nhé!" />
      ) : (
        <>
          {featured && (
            <article className="group relative mb-10 grid overflow-hidden rounded-[1.75rem] bg-surface shadow-soft ring-1 ring-border/60 transition-shadow hover:shadow-lift md:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden bg-sand md:aspect-auto md:min-h-[360px]">
                {featured.coverImage && (
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <span className="mb-3 w-fit rounded-full bg-accent/60 px-3 py-1 text-xs font-semibold text-leaf-900">Mới nhất</span>
                <h2 className="text-2xl leading-snug font-bold text-leaf-900 sm:text-3xl">
                  <Link href={`/tin-tuc/${featured.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-leaf-700">
                    {featured.title}
                  </Link>
                </h2>
                {featured.excerpt && <p className="mt-3 text-muted">{featured.excerpt}</p>}
                {featured.publishedAt && (
                  <p className="mt-5 flex items-center gap-1.5 text-sm text-muted">
                    <CalendarDays className="size-4" aria-hidden />
                    <time dateTime={featured.publishedAt.toISOString()}>{formatDate(featured.publishedAt)}</time>
                  </p>
                )}
              </div>
            </article>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => p && <PostCard key={p.id} post={p} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} makeHref={(p) => (p > 1 ? `/tin-tuc?trang=${p}` : "/tin-tuc")} />
        </>
      )}
    </div>
  );
}
