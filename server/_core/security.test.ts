import { describe, expect, it } from "vitest";
import { securityInternals } from "./security";

describe("security middleware boundaries", () => {
  it("uses the Express-resolved client IP instead of trusting a raw forwarded header", () => {
    const request = {
      ip: "10.0.0.7",
      headers: { "x-forwarded-for": "198.51.100.9" },
    } as never;
    const key = securityInternals.clientKey(request);
    expect(key).toBe("10.0.0.7");
  });

  it("rejects cross-site cookie-authenticated mutations", () => {
    const request = {
      method: "POST",
      headers: { "sec-fetch-site": "cross-site" },
    } as never;
    expect(securityInternals.isTrustedMutationRequest(request)).toEqual({
      allowed: false,
      status: 403,
      reason: "cross-site request blocked",
    });
  });

  it("does not trust forwarded host or protocol from a direct client", () => {
    const request = {
      ip: "203.0.113.8",
      protocol: "http",
      headers: {
        "x-forwarded-host": "attacker.example",
        "x-forwarded-proto": "https",
      },
      get: (name: string) => name === "host" ? "aldora.example" : undefined,
    } as never;
    expect(securityInternals.requestOrigin(request)).toBe("http://aldora.example");
  });

  it("accepts forwarded host and protocol only from loopback proxy", () => {
    const request = {
      ip: "127.0.0.1",
      protocol: "http",
      headers: {
        "x-forwarded-host": "aldora.example",
        "x-forwarded-proto": "https",
      },
      get: (name: string) => name === "host" ? "127.0.0.1:3000" : undefined,
    } as never;
    expect(securityInternals.requestOrigin(request)).toBe("https://aldora.example");
  });

  it("applies stricter limits to authentication and upload routes", () => {
    expect(securityInternals.rateLimitFor("/api/trpc/auth.internalLogin", true)).toEqual({ category: "auth", limit: 12 });
    expect(securityInternals.rateLimitFor("/api/trpc/erp.prescription.upload", true)).toEqual({ category: "upload", limit: 20 });
    expect(securityInternals.rateLimitFor("/api/trpc/erp.sales.commit", true)).toEqual({ category: "mutation", limit: 120 });
    expect(securityInternals.rateLimitFor("/api/trpc/erp.catalog", false)).toBeNull();
  });
});
