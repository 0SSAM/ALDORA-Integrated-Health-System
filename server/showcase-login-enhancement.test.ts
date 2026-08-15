import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("showcase login enhancement contracts", () => {
  it("renders explicit success feedback and routes to the protected workspace", () => {
    const source = read("client/src/pages/Login.tsx");
    expect(source).toContain("تم تسجيل الدخول بنجاح");
    expect(source).toContain("setLocation(\"/workspace\")");
    expect(source).toContain("تجربة الحساب المعزول");
  });

  it("keeps the showcase trial password-free at the browser boundary", () => {
    const source = read("client/src/pages/Login.tsx");
    expect(source).toContain("trpc.auth.showcaseTrial.useMutation");
    expect(source).toContain("showcaseTrial.mutate()");
    expect(source).not.toContain('showcaseTrial.mutate({ password');
  });

  it("keeps the server trial bound to the managed showcase account", () => {
    const source = read("server/routers.ts");
    expect(source).toContain("showcaseTrial: publicProcedure.mutation");
    expect(source).toContain('const username = "test"');
    expect(source).toContain('credential.accountType !== "showcase"');
    expect(source).toContain('sessionMode: "showcase"');
  });

  it("registers a cron-authenticated, read-only login health callback", () => {
    const handler = read("server/scheduled/login-health.ts");
    const server = read("server/_core/index.ts");
    expect(handler).toContain("sdk.authenticateRequest(req)");
    expect(handler).toContain("user.isCron");
    expect(handler).toContain('loginMutation: "not_attempted"');
    expect(server).toContain('app.post("/api/scheduled/login-health", loginHealthHandler)');
  });
});
