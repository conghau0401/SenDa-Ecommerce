"use client";

/** Tìm ảnh làm nguồn bay: chính phần tử ảnh, ảnh bên trong, hoặc ảnh của thẻ sản phẩm chứa nút */
export function resolveFlyImage(source: HTMLElement | null | undefined): HTMLImageElement | null {
  if (!source) return null;
  if (source instanceof HTMLImageElement) return source;
  return (
    source.querySelector<HTMLImageElement>("img") ??
    source.closest("article")?.querySelector<HTMLImageElement>("img") ??
    null
  );
}

/**
 * Hiệu ứng ảnh sản phẩm bay theo đường cong về icon giỏ hàng ([data-cart-target]).
 * Resolve khi ảnh "chạm" giỏ (hoặc ngay lập tức nếu không thể chạy hiệu ứng).
 * `origin`: nếu ảnh đang nằm ngoài màn hình (VD bấm từ thanh sticky), bay từ phần tử này.
 */
export function flyToCart(img: HTMLImageElement | null, origin?: HTMLElement | null): Promise<void> {
  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!img || !target || reduceMotion || typeof Element.prototype.animate !== "function") return Promise.resolve();

  let s = img.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const offscreen = s.bottom < 0 || s.top > window.innerHeight;
  let size = Math.min(s.width, s.height, 220);
  if (offscreen && origin) {
    s = origin.getBoundingClientRect();
    size = 64;
  }
  if (s.width === 0 || t.width === 0) return Promise.resolve();

  const startX = s.left + s.width / 2;
  const startY = s.top + s.height / 2;
  const dx = t.left + t.width / 2 - startX;
  const dy = t.top + t.height / 2 - startY;
  // Đỉnh vòng cung: cao hơn điểm cao nhất một chút
  const arc = Math.min(dy, 0) - 90;

  const ghost = document.createElement("img");
  ghost.src = img.currentSrc || img.src;
  ghost.alt = "";
  ghost.setAttribute("aria-hidden", "true");
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${startX - size / 2}px`,
    top: `${startY - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "20px",
    boxShadow: "0 12px 32px rgb(31 42 34 / 0.25)",
    zIndex: "100",
    pointerEvents: "none",
    willChange: "transform, opacity",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(ghost);

  const animation = ghost.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1, borderRadius: "20px" },
      { transform: "translate(0, -12px) scale(0.9)", opacity: 1, offset: 0.12 },
      { transform: `translate(${dx * 0.55}px, ${arc}px) scale(0.5)`, opacity: 0.95, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.1)`, opacity: 0.5, borderRadius: "50%" },
    ],
    { duration: 800, easing: "cubic-bezier(0.45, 0, 0.25, 1)", fill: "forwards" },
  );

  return new Promise((resolve) => {
    const done = () => {
      ghost.remove();
      resolve();
    };
    animation.onfinish = done;
    animation.oncancel = done;
    // Phòng trường hợp tab bị ẩn và animation không chạy
    setTimeout(done, 1200);
  });
}
