import { describe, expect, it } from "vitest";
import { DEMO_QUERY_POLICY, isDemoQueryAllowed } from "./demo-access";

describe("demo access policy", () => {
  it("allows only explicitly public queries", () => {
    expect(isDemoQueryAllowed("auth.me")).toBe(true);
    expect(isDemoQueryAllowed("system.health")).toBe(true);
    expect(isDemoQueryAllowed("organizations.mine")).toBe(false);
    expect(isDemoQueryAllowed("erp.catalog.search")).toBe(false);
  });

  it("declares a read-only policy", () => {
    expect(DEMO_QUERY_POLICY.mode).toBe("read-only");
    expect(DEMO_QUERY_POLICY.allowlist).not.toContain("organizations.mine");
  });
});
