import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("ALDO visible branding privacy", () => {
  it("does not expose provider branding in the login dialog UI copy", async () => {
    const source = await readFile(new URL("../client/src/components/SecureLoginDialog.tsx", import.meta.url), "utf8");
    expect(source).not.toMatch(/Manus|Please login with|Login with/);
    expect(source).toContain("تسجيل الدخول الآمن للمتابعة");
    expect(source).toContain("تسجيل الدخول");
  });

  it("keeps the shipped application title driven by ALDO branding", async () => {
    const source = await readFile(new URL("../client/index.html", import.meta.url), "utf8");
    expect(source).toContain("%VITE_APP_TITLE%");
    expect(source).not.toMatch(/<title>[^<]*manus[^<]*<\/title>/i);
  });

  it("does not print provider branding from the shipped debug asset", async () => {
    const source = await readFile(new URL("../client/public/__manus__/debug-collector.js", import.meta.url), "utf8");
    expect(source).not.toMatch(/Manus Debug Collector|\[Manus\]/);
    expect(source).toContain("ALDO Debug Collector");
    expect(source).toContain("[ALDO]");
  });
});
