import { describe, expect, it, vi } from "vitest";

const mocked = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, getDb: mocked.getDb };
});

import { appRouter } from "./routers";

function fakeDb(values: unknown[]) {
  let index = 0;
  return {
    select() {
      const value = values[index++];
      const chain = new Proxy({}, {
        get: (_target, property) => {
          if (property === "then") return (resolve: (value: unknown) => unknown) => Promise.resolve(value).then(resolve);
          return () => chain;
        },
      });
      return chain;
    },
  };
}

const ctx = { user: { id: 1 } as any, req: {} as any, res: {} as any };

describe("privacy tRPC routes", () => {
  it("search.all excludes users and posts blocked in either direction", async () => {
    mocked.getDb.mockResolvedValue(fakeDb([
      [{ blockerId: 1, blockedId: 2 }],
      [{ id: 2, name: "محظور" }, { id: 3, name: "ظاهر" }],
      [{ post: { id: 9 }, author: { id: 2 } }, { post: { id: 10 }, author: { id: 3 } }],
    ]));
    const result = await appRouter.createCaller(ctx as any).search.all({ q: "مصمم" });
    expect(result.users.map(user => user.id)).toEqual([3]);
    expect(result.posts.map(post => post.author.id)).toEqual([3]);
  });

  it("notifications.list excludes actors blocked in either direction", async () => {
    mocked.getDb.mockResolvedValue(fakeDb([
      [{ notification: { id: 1 }, actor: { id: 2 } }, { notification: { id: 2 }, actor: { id: 3 } }],
      [{ blockerId: 2, blockedId: 1 }],
    ]));
    const result = await appRouter.createCaller(ctx as any).notifications.list();
    expect(result.map(row => row.actor.id)).toEqual([3]);
  });

  it("messages.inbox excludes participants blocked in either direction", async () => {
    mocked.getDb.mockResolvedValue(fakeDb([
      [{ conversationId: 10 }],
      [
        { conversation: { id: 10, updatedAt: new Date("2026-09-05T10:00:00Z") }, user: { id: 2, name: "محظور", verified: 0, level: "1" } },
        { conversation: { id: 11, updatedAt: new Date("2026-09-05T11:00:00Z") }, user: { id: 3, name: "ظاهر", verified: 0, level: "1" } },
      ],
      [{ plan: "free" }],
      [{ plan: "vip" }],
      [{ blockerId: 1, blockedId: 2 }],
    ]));
    const result = await appRouter.createCaller(ctx as any).messages.inbox();
    expect(result.map(item => item.participant.id)).toEqual([3]);
  });
});
