import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

const { getDbMock } = vi.hoisted(() => ({ getDbMock: vi.fn() }));
vi.mock("../db", () => ({ getDb: getDbMock }));

type TestUser = NonNullable<TrpcContext["user"]>;

const staffUser: TestUser = {
  id: 81,
  openId: "compliance-contract-user",
  email: "compliance-contract@example.com",
  name: "Compliance Contract User",
  loginMethod: "manus",
  role: "manager",
  createdAt: new Date(0),
  updatedAt: new Date(0),
  lastSignedIn: new Date(0),
};

function contextFor(user: TestUser): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("regional compliance protected router contracts", () => {
  beforeEach(() => getDbMock.mockReset());

  it("denies non-admin pack creation before opening the database", async () => {
    const caller = appRouter.createCaller(contextFor(staffUser));
    await expect(caller.regional.createPack({
      jurisdictionId: 7,
      packVersion: "2026.1",
      authorityName: "Authority",
      sourceUrl: "https://authority.example/rules",
      effectiveFrom: new Date("2026-01-01T00:00:00.000Z"),
      rules: { catalog: true },
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(getDbMock).not.toHaveBeenCalled();
  });

  it("denies non-admin audit-history access before opening the database", async () => {
    const caller = appRouter.createCaller(contextFor(staffUser));
    await expect(caller.regional.listPackAudits({ packId: 7 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(getDbMock).not.toHaveBeenCalled();
  });

  it("rejects approval for a stale pack before mutation or audit writes", async () => {
    const admin = { ...staffUser, id: 82, role: "admin" as const };
    const rows = [
      [{ id: 7, status: "review", jurisdictionId: 3, rulesJson: JSON.stringify({ tax: true }), effectiveFrom: new Date("2026-01-01"), reviewDueAt: new Date("2026-08-01") }],
      [{ id: 9, packId: 7, ruleKey: "tax", verificationStatus: "verified" }],
    ];
    const next = () => rows.shift() ?? [];
    const db = { select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => { const p = Promise.resolve(next()) as Promise<unknown[]> & { limit: () => Promise<unknown[]> }; p.limit = async () => next(); return p; }) })) })), update: vi.fn(), insert: vi.fn() };
    getDbMock.mockResolvedValue(db);
    const caller = appRouter.createCaller(contextFor(admin));
    await expect(caller.regional.approvePack({ packId: 7, reason: "stale pack" })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    expect(db.update).not.toHaveBeenCalled();
    expect(db.insert).not.toHaveBeenCalled();
  });
});
