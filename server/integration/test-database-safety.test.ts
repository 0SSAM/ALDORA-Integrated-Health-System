import { describe, expect, it } from "vitest";
import {
  isIsolatedTestDatabaseLifecycleEnabled,
  isIsolatedTestDatabaseUrl,
} from "./test-database-safety";

describe("test database safety", () => {
  it("requires an explicit isolation marker", () => {
    expect(
      isIsolatedTestDatabaseUrl(
        "mysql://user:pass@test-db.local/aldora_test",
        undefined
      )
    ).toBe(false);
    expect(
      isIsolatedTestDatabaseUrl(
        "mysql://user:pass@test-db.local/aldora_test",
        "false"
      )
    ).toBe(false);
  });

  it("rejects production-like hosts even when marked", () => {
    expect(
      isIsolatedTestDatabaseUrl("mysql://user:pass/aldora_test", "true")
    ).toBe(false);
    expect(
      isIsolatedTestDatabaseUrl(
        "mysql://user:pass@prod-db.local/aldora_test",
        "true"
      )
    ).toBe(false);
  });

  it("requires a non-root account and a test-labelled database name", () => {
    expect(
      isIsolatedTestDatabaseUrl("mysql://user:pass@test-db.local/app", "true")
    ).toBe(false);
    expect(
      isIsolatedTestDatabaseUrl(
        "mysql://root:pass@test-db.local/aldora_test",
        "true"
      )
    ).toBe(false);
  });

  it("accepts only supported, explicitly isolated test URLs", () => {
    expect(
      isIsolatedTestDatabaseUrl(
        "mysql://user:pass@test-db.local/aldora_test",
        "true"
      )
    ).toBe(true);
    expect(
      isIsolatedTestDatabaseUrl(
        "mysql://user:pass@test-db.local/aldora_ci_test",
        "true"
      )
    ).toBe(true);
    expect(
      isIsolatedTestDatabaseUrl(
        "postgres://user:pass@test-db.local/aldora_test",
        "true"
      )
    ).toBe(false);
  });

  it("requires a second explicit marker before lifecycle operations", () => {
    const url = "mysql://user:pass@test-db.local/aldora_test";
    expect(isIsolatedTestDatabaseLifecycleEnabled(url, "true", undefined)).toBe(
      false
    );
    expect(
      isIsolatedTestDatabaseLifecycleEnabled(url, "true", "disabled")
    ).toBe(false);
    expect(isIsolatedTestDatabaseLifecycleEnabled(url, "true", "enabled")).toBe(
      true
    );
  });
});
