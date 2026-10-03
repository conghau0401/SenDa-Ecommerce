// Icon thương hiệu mạng xã hội (lucide không kèm icon brand)
type IconProps = React.SVGProps<SVGSVGElement>;

export const FacebookIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4a20 20 0 0 0-2.3-.1c-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.4V21h3.1Z" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const TiktokIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M16.6 3c.3 2.3 1.6 3.8 3.9 4v2.6a6.8 6.8 0 0 1-3.9-1.3v5.9c0 3.8-3.3 6.3-6.8 5.3-3.5-1-4.5-5.4-2-8 1.2-1.2 3-1.8 4.6-1.5v2.8c-.5-.2-1-.2-1.5-.1-1.5.3-2.3 1.9-1.6 3.2.6 1.3 2.4 1.6 3.4.6.4-.4.6-1 .6-1.6V3h3.3Z" />
  </svg>
);

export const YoutubeIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);

export const ZaloIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden {...p}>
    <path d="M12 3.5c-5 0-9 3.4-9 7.7 0 2.4 1.3 4.6 3.4 6l-.6 3.3 3.3-1.8c.9.2 1.9.3 2.9.3 5 0 9-3.4 9-7.8s-4-7.7-9-7.7Z" />
    <text x="12" y="13.6" textAnchor="middle" fontSize="6.2" fontWeight="700" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif">
      Zalo
    </text>
  </svg>
);
