/**
 * Chạy dev server (Turbopack) và tự làm nóng mọi trang khi server sẵn sàng.
 *
 *   npm run dev:warm            # cổng 3000
 *   npm run dev:warm -- 3001    # cổng khác
 *
 * Ctrl + C để dừng như bình thường.
 */
import { spawn } from "node:child_process";
import { warmup } from "./warmup.mjs";

const port = /^\d+$/.test(process.argv[2] ?? "") ? process.argv[2] : "3000";

const child = spawn("npx", ["next", "dev", "--turbopack", "-p", port], {
  stdio: "inherit",
  shell: process.platform === "win32", // cần trên Windows để chạy npx
});

const stop = (code) => {
  if (!child.killed) child.kill();
  process.exit(code ?? 0);
};
child.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

// Chạy warmup song song (tự chờ server sẵn sàng)
warmup(`http://localhost:${port}`).catch((err) => console.error("warmup:", err.message));
