import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "img.vietqr.io" }],
  },
  // Chỉ ảnh hưởng `next dev`: giữ trang đã biên dịch lâu hơn (mặc định webpack bỏ sau 60 giây
  // không dùng và chỉ giữ 5 trang -> quay lại menu cũ phải biên dịch lại, warmup nhanh "nguội").
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 100,
  },
};

export default nextConfig;
