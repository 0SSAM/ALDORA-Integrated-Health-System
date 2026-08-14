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
});
