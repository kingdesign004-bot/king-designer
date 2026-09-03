import { describe, expect, it } from "vitest";
import { postShares } from "../drizzle/schema";
import { countPostShares } from "./db";

describe("postShares", () => {
  it("exposes the columns required by share mutations", () => {
    expect(postShares).toHaveProperty("id");
    expect(postShares).toHaveProperty("postId");
    expect(postShares).toHaveProperty("userId");
    expect(postShares).toHaveProperty("createdAt");
  });

  it("counts shares through the same helper used by the feed", async () => {
    const chain = {
      select: () => chain,
      from: () => chain,
      where: async () => [{ count: "3" }],
    };
    const count = await countPostShares(chain as unknown as Parameters<typeof countPostShares>[0], 30001);
    expect(count).toBe(3);
  });
});
