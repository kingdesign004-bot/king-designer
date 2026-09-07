import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const schemaSource = readFileSync(new URL("../drizzle/schema.ts", import.meta.url), "utf8");
const drizzleConfig = readFileSync(new URL("../drizzle.config.ts", import.meta.url), "utf8");

describe("database runtime configuration", () => {
  it("uses the MySQL/TiDB driver instead of the old PostgreSQL driver", () => {
    expect(packageJson.dependencies.mysql2).toBeTruthy();
    expect(packageJson.dependencies.postgres).toBeUndefined();
    expect(schemaSource).toContain("mysqlTable");
    expect(schemaSource).not.toContain("pgTable");
    expect(drizzleConfig).toContain('dialect: "mysql"');
  });
});
