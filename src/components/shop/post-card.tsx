import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { PostCardData } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export function PostCard({ post }: { post: PostCardData }) {
  const href = `/tin-tuc/${post.slug}`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-soft ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.publishedAt && (
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <CalendarDays className="size-3.5" aria-hidden />
            <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
          </p>
        )}
        <h3 className="mt-2 line-clamp-2 text-lg leading-snug font-semibold text-leaf-900">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] group-hover:text-leaf-700">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>}
        <p className="mt-auto pt-4 text-sm font-semibold text-leaf-700">Đọc tiếp →</p>
      </div>
    </article>
  );
}
