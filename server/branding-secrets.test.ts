import { describe, expect, it } from "vitest";

describe("ALDORA branding configuration", () => {
  it("serves the application endpoint with the configured Arabic brand title", async () => {
    const response = await fetch("http://127.0.0.1:3000/");
    expect(response.ok).toBe(true);
    const html = await response.text();
    expect(process.env.VITE_APP_TITLE).toBe("ألدورا | منظومة الرعاية الصحية المتكاملة");
    expect(process.env.VITE_APP_LOGO).toMatch(/^https:\/\//);
    expect(html).toContain("<title>ألدورا | منظومة الرعاية الصحية المتكاملة</title>");
  });
});
