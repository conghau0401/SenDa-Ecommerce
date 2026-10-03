import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/post-form";

export const metadata: Metadata = { title: "Viết bài mới" };

export default function NewPostPage() {
  return (
    <>
      <PageHeader title="Viết bài mới" back={{ href: "/admin/tin-tuc", label: "Tin tức" }} />
      <PostForm
        id={null}
        initial={{
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          coverImage: "",
          status: "DRAFT",
          publishedAt: "",
          metaTitle: "",
          metaDescription: "",
        }}
      />
    </>
  );
}
