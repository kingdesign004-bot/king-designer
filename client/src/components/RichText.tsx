import React, { useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type Token = { value: string; type: "text" | "mention" | "hashtag" };
export function tokenize(value: string) {
  return value.split(/(#[\u0600-\u06FFA-Za-z0-9_-]+|@[\u0600-\u06FFA-Za-z0-9_.-]+)/g).filter(Boolean).map((value): Token => value.startsWith("#") ? { value, type: "hashtag" } : value.startsWith("@") ? { value, type: "mention" } : { value, type: "text" });
}
export function tokenHref(token: Token, resolved?: Record<string, number>) { const handle = token.value.slice(1); return token.type === "mention" && resolved?.[handle] ? `/profile/${resolved[handle]}` : `/search?q=${encodeURIComponent(token.value)}`; }
export default function RichText({ text }: { text?: string | null }) {
  const tokens = useMemo(() => tokenize(text || ""), [text]); const handles = useMemo(() => tokens.filter(token => token.type === "mention").map(token => token.value.slice(1)), [tokens]); const { data: resolved } = trpc.search.resolveMentions.useQuery({ handles }, { enabled: handles.length > 0 });
  return <>{tokens.map((token, index) => { if (token.type === "text") return <span key={index}>{token.value}</span>; const href = tokenHref(token, resolved); return <Link key={index} href={href} className="font-bold text-[#a36e00] underline decoration-[#ead48d] underline-offset-4" aria-label={token.type === "mention" ? `فتح ملف ${token.value}` : `البحث عن ${token.value}`}>{token.value}</Link>; })}</>;
}
