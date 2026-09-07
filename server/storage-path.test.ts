import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routersSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");

describe("storage key permissions", () => {
  it("uses the WebDev user-scoped storage key format for uploads", () => {
    expect(routersSource).toContain("${ctx.user.id}-files/uploads/");
    expect(routersSource).toContain("${ctx.user.id}-files/splash/");
    expect(routersSource).not.toContain("${ctx.user.id}/uploads/");
    expect(routersSource).not.toContain("${ctx.user.id}/splash/");
  });
});
