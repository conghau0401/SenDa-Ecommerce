import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { getActiveCategories, getHomeProducts, getLatestPosts } from "@/lib/queries";
import { HeroSlider } from "@/components/shop/hero-slider";
import { CategoryCard } from "@/components/shop/category-card";
import { ProductGrid } from "@/components/shop/product-grid";
import { PostCard } from "@/components/shop/post-card";
import { WhyUs } from "@/components/shop/why-us";
import { Reveal } from "@/components/shop/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getSettings();
  const ogImage = home.banners[0]?.image;
  return {
    alternates: { canonical: "/" },
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  };
}

export default async function HomePage() {
  const [settings, categories, { featured, latest }, posts] = await Promise.all([
    getSettings(),
    getActiveCategories(),
    getHomeProducts(),
    getLatestPosts(3),
  ]);

  return (
    <div className="space-y-16 pb-4 sm:space-y-24">
      <div className="container-page pt-4 sm:pt-6">
        {settings.home.banners.length > 0 ? (
          <HeroSlider banners={settings.home.banners} />
        ) : (
          <h1 className="py-10 text-center text-3xl font-bold text-leaf-800">{settings.store.name}</h1>
        )}
      </div>

      {categories.length > 0 && (
        <section className="container-page">
          <SectionHeading eyebrow="Danh mục" title="Khám phá theo loại cây" href="/san-pham" />
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={(i % 4) * 0.06} className="w-40 shrink-0 snap-start sm:w-auto">
                <CategoryCard category={c} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="container-page">
          <SectionHeading
            eyebrow="Được yêu thích"
            title="Sản phẩm nổi bật"
            description="Những chậu sen đá được khách hàng chọn mua nhiều nhất."
            href="/san-pham"
          />
          <ProductGrid products={featured} />
        </section>
      )}

      <div className="container-page">
        <WhyUs freeThreshold={settings.shipping.freeThreshold} />
      </div>

      {latest.length > 0 && (
        <section className="container-page">
          <SectionHeading eyebrow="Vừa cập bến" title="Sản phẩm mới" href="/san-pham?sap-xep=moi-nhat" />
          <ProductGrid products={latest} />
        </section>
      )}

      {posts.length > 0 && (
        <section className="container-page">
          <SectionHeading
            eyebrow="Góc chăm cây"
            title="Bài viết mới nhất"
            description="Mẹo chăm sóc, nhân giống và bày trí sen đá từ những người làm vườn."
            href="/tin-tuc"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08} className="h-full">
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
