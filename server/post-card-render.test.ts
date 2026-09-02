import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/trpc", () => {
  const mutation = () => ({ mutate: vi.fn(), mutateAsync: vi.fn(async () => ({ url: "https://example.test/file", key: "file" })), isPending: false });
  const utils = { feed: { list: { invalidate: vi.fn() } }, comments: { list: { invalidate: vi.fn() } } };
  return { trpc: { useUtils: () => utils, search: { resolveMentions: { useQuery: () => ({ data: { "مصمم": 7 } }) } }, posts: { toggleLike: { useMutation: mutation }, share: { useMutation: mutation }, update: { useMutation: mutation }, delete: { useMutation: mutation }, interactors: { useQuery: () => ({ data: { likes: [], comments: [] }, isLoading: false }) } }, comments: { list: { useQuery: () => ({ data: [] }) }, create: { useMutation: mutation }, delete: { useMutation: mutation }, toggleLike: { useMutation: mutation } }, media: { upload: { useMutation: mutation } } } };
});
vi.mock("wouter", () => ({ Link: ({ href, children }: { href: string; children: React.ReactNode }) => React.createElement("a", { href }, children) }));
vi.mock("@/components/ui/button", () => ({ Button: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => React.createElement("button", props, children) }));
vi.mock("@/components/ui/input", () => ({ Input: (props: Record<string, unknown>) => React.createElement("input", props) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));

import PostCard from "../client/src/components/PostCard";

describe("PostCard clickable rich content", () => {
  it("renders resolved mentions and hashtags as anchors inside the card", () => {
    const post = { id: 1, authorId: 1, title: "هوية", description: "وصف #هوية مع @مصمم", hashtags: "#هوية", visibility: "public", createdAt: new Date(), author: { id: 1, name: "صاحب العمل", avatarUrl: null }, media: [], likesCount: 0, commentsCount: 0, sharesCount: 0, liked: false };
    const html = renderToStaticMarkup(React.createElement(PostCard, { post, isAuthenticated: false, viewerId: 8 }));
    expect(html).toContain('href="/profile/7"');
    expect(html).toContain('href="/search?q=%23%D9%87%D9%88%D9%8A%D8%A9"');
  });
});
