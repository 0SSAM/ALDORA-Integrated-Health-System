import { describe, expect, it } from "vitest";
import {
  INTERNAL_MAX_FAILED_ATTEMPTS,
  createInternalSessionToken,
  hashInternalPassword,
  hashAuditRecord,
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

  it("fails closed for malformed password records", () => {
    expect(verifyInternalPassword("StrongEmployeePassword9", "scrypt$not-a-number$8$1$bad$bad")).toBe(false);
    expect(verifyInternalPassword("StrongEmployeePassword9", "scrypt$16384$8$1$bad$bad")).toBe(false);
  });

  it("requires a configured audit signing key", () => {
    const previous = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    expect(() => hashAuditRecord({ eventType: "test", createdAt: new Date().toISOString() })).toThrow(/Audit signing key/);
    if (previous === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previous;
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
