import { describe, expect, it } from "vitest";
import {
  INTERNAL_MAX_FAILED_ATTEMPTS,
  createInternalSessionToken,
  hashInternalPassword,
  isLocked,
  normalizeInternalUsername,
  verifyInternalPassword,
} from "./internal-auth";

describe("internal employee authentication contract", () => {
  it("normalizes usernames without changing their identity semantics", () => {
    expect(normalizeInternalUsername("  Cashier.Branch1 ")).toBe("cashier.branch1");
  });

  it("hashes passwords and verifies only the original password", () => {
    const password = "StrongEmployeePassword9";
    const hash = hashInternalPassword(password);
    expect(hash).not.toContain(password);
    expect(verifyInternalPassword(password, hash)).toBe(true);
    expect(verifyInternalPassword("wrong password", hash)).toBe(false);
  });

  it("uses a bounded lockout threshold", () => {
    expect(INTERNAL_MAX_FAILED_ATTEMPTS).toBeGreaterThanOrEqual(5);
    expect(isLocked(new Date(Date.now() + 60_000), new Date())).toBe(true);
    expect(isLocked(new Date(Date.now() - 1), new Date())).toBe(false);
    expect(isLocked(null, new Date())).toBe(false);
  });

  it("creates high-entropy opaque session tokens", () => {
    const first = createInternalSessionToken();
    const second = createInternalSessionToken();
    expect(first).not.toBe(second);
    expect(first.length).toBeGreaterThanOrEqual(40);
  });
});
