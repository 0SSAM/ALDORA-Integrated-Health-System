import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

function contextFor(role: "admin" | "user"): TrpcContext {
  return {
    user: {
      id: role === "admin" ? 1 : 2,
      openId: `${role}-connector-readiness`,
      email: `${role}@example.com`,
      name: role === "admin" ? "Connector Admin" : "Scoped User",
      loginMethod: "internal",
      role,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      lastSignedIn: new Date(0),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("connector readiness dashboard contract", () => {
  it("allows admins to read redacted fail-closed readiness only", async () => {
    const result = await appRouter.createCaller(contextFor("admin")).auth.connectorReadiness();

    expect(result.activationPolicy).toBe("fail-closed");
    expect(result.connectors).toHaveLength(2);
    expect(result.connectors.every(connector => connector.state === "blocked")).toBe(true);
    expect(result.connectors.every(connector => connector.readinessPercent === 0)).toBe(true);
    expect(JSON.stringify(result)).not.toMatch(/password|token|secret|apiKey|authorization/i);
  });

  it("rejects non-admin users before exposing connector readiness", async () => {
    await expect(appRouter.createCaller(contextFor("user")).auth.connectorReadiness()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
