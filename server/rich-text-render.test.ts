import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/trpc", () => ({ trpc: { search: { resolveMentions: { useQuery: () => ({ data: { "مصمم": 7 } }) } } } }));
vi.mock("wouter", () => ({ Link: ({ href, children }: { href: string; children: React.ReactNode }) => React.createElement("a", { href }, children) }));

import RichText from "../client/src/components/RichText";

describe("RichText clickable rendering", () => {
  it("renders resolved mentions and hashtags as clickable anchors", () => {
    const element = React.createElement(RichText, { text: "مشروع #هوية مع @مصمم" });
    const html = renderToStaticMarkup(element);
    expect(html).toContain('href="/search?q=%23%D9%87%D9%88%D9%8A%D8%A9"');
    expect(html).toContain('href="/profile/7"');
    expect(html).toContain("@مصمم");
  });
});
