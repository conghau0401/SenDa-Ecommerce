import { Fragment } from "react";
import Link from "next/link";

/**
 * Hiển thị định dạng đơn giản trong tin nhắn bot (không dùng innerHTML):
 * **đậm**, ~~gạch~~, [chữ](/duong-dan), xuống dòng, dòng "- " -> danh sách.
 */
const TOKEN = /(\*\*[^*]+\*\*|~~[^~]+~~|\[[^\]]+\]\([^)\s]+\))/g;

function safeHref(href: string): string | null {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (/^(https:\/\/|mailto:|tel:)/i.test(href)) return href;
  return null;
}

function Inline({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        if (part.startsWith("~~") && part.endsWith("~~")) return <s key={i} className="opacity-60">{part.slice(2, -2)}</s>;
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
          const href = safeHref(link[2]);
          if (!href) return <Fragment key={i}>{link[1]}</Fragment>;
          return href.startsWith("/") ? (
            <Link key={i} href={href} onClick={onNavigate} className="font-medium text-leaf-700 underline underline-offset-2 hover:text-leaf-800">
              {link[1]}
            </Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-leaf-700 underline underline-offset-2">
              {link[1]}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function ChatRichText({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
  const lines = text.split("\n");
  const blocks: ({ type: "p"; text: string } | { type: "ul"; items: string[] })[] = [];
  for (const line of lines) {
    const bullet = line.match(/^\s*[-•]\s+(.*)$/);
    if (bullet) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(bullet[1]);
      else blocks.push({ type: "ul", items: [bullet[1]] });
    } else if (line.trim()) {
      blocks.push({ type: "p", text: line });
    }
  }
  return (
    <div className="space-y-1.5">
      {blocks.map((b, i) =>
        b.type === "p" ? (
          <p key={i}>
            <Inline text={b.text} onNavigate={onNavigate} />
          </p>
        ) : (
          <ul key={i} className="list-disc space-y-0.5 pl-4 marker:text-leaf-500">
            {b.items.map((it, j) => (
              <li key={j}>
                <Inline text={it} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
