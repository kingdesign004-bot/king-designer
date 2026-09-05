import { describe, expect, it } from "vitest";
import { filterBlockedRecords, filterInboxParticipants, filterNotificationRows, filterSearchResults, getMutualBlockedIds } from "./db";

describe("blocked privacy filters", () => {
  const blocked = getMutualBlockedIds([{ blockerId: 1, blockedId: 2 }, { blockerId: 3, blockedId: 1 }], 1);

  it("filters search.all users and posts in both directions", () => {
    expect(filterSearchResults([{ id: 2 }, { id: 4 }], [{ author: { id: 3 } }, { author: { id: 4 } }], blocked)).toEqual({ users: [{ id: 4 }], posts: [{ author: { id: 4 } }] });
  });

  it("filters notifications.list actors in both directions", () => {
    expect(filterNotificationRows([{ actor: { id: 2 } }, { actor: { id: 4 } }], blocked)).toEqual([{ actor: { id: 4 } }]);
  });

  it("filters messages.inbox participants in both directions", () => {
    expect(filterInboxParticipants([{ participant: { id: 3 } }, { participant: { id: 4 } }], blocked)).toEqual([{ participant: { id: 4 } }]);
  });

  it("removes blocked actors from generic user-facing records", () => {
    expect(filterBlockedRecords([{ actorId: 2 }, { actorId: 4 }], blocked, row => row.actorId)).toEqual([{ actorId: 4 }]);
  });
});
