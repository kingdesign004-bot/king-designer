import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const schema = readFileSync(new URL("../drizzle/schema.ts", import.meta.url), "utf8");
const router = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const sdk = readFileSync(new URL("./_core/sdk.ts", import.meta.url), "utf8");
const home = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
const stories = readFileSync(new URL("../client/src/components/StoriesStrip.tsx", import.meta.url), "utf8");

describe("policy feature contracts", () => {
  it("keeps account verification and support data in the schema", () => {
    expect(schema).toContain("verificationRequests");
    expect(schema).toContain("supportTickets");
    expect(schema).toContain("accountType");
    expect(schema).toContain("verificationStatus");
  });

  it("exposes stories, verification, support, and attachment-aware reports", () => {
    expect(router).toContain("verification: router");
    expect(router).toContain("support: router");
    expect(router).toContain("stories: router");
    expect(router).toContain("attachmentDuration");
    expect(router).toContain("update: protectedProcedure.input(z.object({ storyId");
    expect(router).toContain("delete: protectedProcedure.input(z.object({ storyId");
    expect(router).toContain("10 * 60 * 1000");
  });

  it("keeps the post-login account choice, explore entry point, and PDF publishing contract", () => {
    expect(home).toContain("PostLoginOnboarding");
    expect(home).toContain("/explore");
    expect(router).toContain('"application/pdf"');
    expect(router).toContain('"pdf"');
    expect(stories).toContain("visibility");
    expect(stories).toContain("viewerId");
  });

  it("enforces active administrative bans at session resolution", () => {
    expect(sdk).toContain("const activeBan");
    expect(sdk).toContain("تم إيقاف الحساب");
    expect(sdk).toContain("banReason");
  });
});
