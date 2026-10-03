/** Linh vật "Bé Sen": chậu sen đá có mặt cười – dùng cho nút chat và avatar bot */
export function Mascot({ className, blink = false }: { className?: string; blink?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      {/* lá sau */}
      <ellipse cx="20" cy="25" rx="7" ry="13" transform="rotate(-35 20 25)" fill="#4f9d69" />
      <ellipse cx="44" cy="25" rx="7" ry="13" transform="rotate(35 44 25)" fill="#4f9d69" />
      <ellipse cx="32" cy="18" rx="7.5" ry="14" fill="#3e8455" />
      {/* lá trước */}
      <ellipse cx="25" cy="29" rx="6.5" ry="11" transform="rotate(-18 25 29)" fill="#74b98c" />
      <ellipse cx="39" cy="29" rx="6.5" ry="11" transform="rotate(18 39 29)" fill="#74b98c" />
      <ellipse cx="32" cy="27" rx="6" ry="10" fill="#a8d5ba" />
      {/* đầu lá hồng */}
      <circle cx="32" cy="17.5" r="1.6" fill="#f2a1a1" />
      <circle cx="21" cy="17" r="1.3" fill="#f2a1a1" />
      <circle cx="43" cy="17" r="1.3" fill="#f2a1a1" />
      {/* chậu */}
      <path d="M14 36h36l-4 21a5 5 0 0 1-5 4H23a5 5 0 0 1-5-4z" fill="#e3a575" />
      <rect x="12" y="33" width="40" height="7" rx="3.5" fill="#d48b58" />
      {/* mặt */}
      <g className={blink ? "origin-center animate-[mascot-blink_4s_infinite]" : undefined}>
        <ellipse cx="25.5" cy="47" rx="2" ry="2.4" fill="#3b2a20" />
        <ellipse cx="38.5" cy="47" rx="2" ry="2.4" fill="#3b2a20" />
        <circle cx="26.2" cy="46.2" r="0.7" fill="#fff" />
        <circle cx="39.2" cy="46.2" r="0.7" fill="#fff" />
      </g>
      <ellipse cx="21" cy="51.5" rx="2.6" ry="1.6" fill="#f08c8c" opacity="0.7" />
      <ellipse cx="43" cy="51.5" rx="2.6" ry="1.6" fill="#f08c8c" opacity="0.7" />
      <path d="M29.5 51.5q2.5 2.6 5 0" stroke="#3b2a20" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
