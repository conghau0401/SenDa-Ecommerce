"use client";

import { useEffect, useState } from "react";

/** true sau khi component mount ở client – tránh lệch hydration với dữ liệu từ localStorage */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
