import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CategoryCard({
  category,
}: {
  category: { name: string; slug: string; image: string | null; _count?: { products: number } };
}) {
  return (
    <Link
      href={`/danh-muc/${category.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-leaf-100 shadow-soft transition-shadow duration-300 hover:shadow-lift"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-leaf-900/80 via-leaf-900/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white">
        <div>
          <h3 className="font-semibold leading-tight sm:text-lg">{category.name}</h3>
          {category._count && <p className="mt-0.5 text-xs text-white/80">{category._count.products} sản phẩm</p>}
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-all group-hover:rotate-45 group-hover:bg-white group-hover:text-leaf-800">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
