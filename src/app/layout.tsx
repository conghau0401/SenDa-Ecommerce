import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { store } = await getSettings();
  const description =
    store.slogan || "Cửa hàng sen đá, xương rồng và tiểu cảnh terrarium – cây khỏe, giá tốt, giao tận nơi.";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${store.name} – Sen đá & tiểu cảnh xinh xắn`, template: `%s | ${store.name}` },
    description,
    openGraph: { type: "website", locale: "vi_VN", siteName: store.name, description },
  };
}

export const viewport: Viewport = {
  themeColor: "#2F6B3A",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
