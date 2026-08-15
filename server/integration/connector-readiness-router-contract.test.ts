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
    expect(result.filterOptions.providers).toEqual(expect.arrayContaining(["UPA", "EDA", "TPA / Payer APIs"]));
    expect(result.auditLog).toHaveLength(2);
    expect(result.auditLog.every(entry => entry.integrity === "tamper-evident" && entry.recordHash.match(/^[a-f0-9]{64}$/))).toBe(true);
    expect(result.alerts).toHaveLength(4);
    expect(result.alerts.filter(alert => alert.kind === "expiry")).toHaveLength(2);
    expect(result.alerts.filter(alert => alert.kind === "status-change")).toHaveLength(2);
    expect(result.alerts.some(alert => alert.severity === "warning" || alert.severity === "critical")).toBe(true);
    expect(result.alerts.every(alert => alert.acknowledged === false)).toBe(true);
    expect(JSON.stringify(result)).not.toMatch(/password|token|secret|apiKey|authorization/i);
  });

  it("applies country, provider, connector type, and readiness filters together", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    const government = await caller.auth.connectorReadiness({ countryCode: "EG", provider: "UPA", connectorType: "government-regulatory", readinessState: "blocked" });
    expect(government.connectors.map(connector => connector.id)).toEqual(["egypt-government"]);
    expect(government.auditLog).toHaveLength(1);

    const insurance = await caller.auth.connectorReadiness({ countryCode: "EG", provider: "TPA / Payer APIs", connectorType: "insurance-payer", readinessState: "blocked" });
    expect(insurance.connectors.map(connector => connector.id)).toEqual(["insurance-payers"]);
    expect(insurance.alerts.every(alert => alert.connectorId === "insurance-payers")).toBe(true);
  });

  it("rejects invalid filters and non-admin users before exposing readiness or audit data", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    await expect(caller.auth.connectorReadiness({ provider: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(appRouter.createCaller(contextFor("user")).auth.connectorReadiness({ countryCode: "EG" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
