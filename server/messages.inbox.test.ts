import { describe, expect, it } from "vitest";
import { filterInboxItems, sortInboxItems } from "./db";

describe("messages inbox", () => {
  it("sorts conversations by newest activity", () => {
    const result = sortInboxItems([
      { conversationId: 1, updatedAt: "2026-09-03T10:00:00.000Z" },
      { conversationId: 2, updatedAt: "2026-09-03T12:00:00.000Z" },
    ]);
    expect(result.map(item => item.conversationId)).toEqual([2, 1]);
  });

  it("keeps only conversations where the current user is a member", () => {
    const result = filterInboxItems([{ conversationId: 11 }, { conversationId: 22 }], [11]);
    expect(result).toEqual([{ conversationId: 11 }]);
  });
});
