import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const base = { protocol: "https", headers: {} } as TrpcContext["req"];
const response = {} as TrpcContext["res"];
const user = { id: 7, openId: "user-7", email: "user@example.com", name: "User", loginMethod: "oauth", role: "user" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(), avatarUrl: null, coverUrl: null, bio: null, country: null, specialty: null, level: null, isOnline: 0, lastSeenAt: new Date() };

function context(overrides: Partial<TrpcContext> = {}): TrpcContext { return { user: null, req: base, res: response, ...overrides }; }

describe("platform authorization", () => {
  it("rejects profile changes for anonymous visitors", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.profile.update({ name: "New Name" })).rejects.toSatisfy((error: { code?: string }) => error.code === "UNAUTHORIZED");
  });
  it("rejects admin splash access for regular users", async () => {
    const caller = appRouter.createCaller(context({ user }));
    await expect(caller.splash.adminList()).rejects.toSatisfy((error: { code?: string }) => error.code === "FORBIDDEN");
  });
  it("rejects private messaging for anonymous visitors", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.messages.send({ conversationId: 1, body: "hello", messageType: "text" })).rejects.toSatisfy((error: { code?: string }) => error.code === "UNAUTHORIZED");
  });
});
