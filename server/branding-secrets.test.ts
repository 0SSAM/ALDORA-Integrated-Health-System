import { describe, expect, it } from "vitest";

describe("ALDO branding configuration", () => {
  it("serves the application endpoint with the configured ALDO branding values", async () => {
    const response = await fetch("http://127.0.0.1:3000/");
    expect(response.ok).toBe(true);
    const html = await response.text();
    expect(process.env.VITE_APP_TITLE).toBe("ALDO Health Care Eco System");
    expect(process.env.VITE_APP_LOGO).toMatch(/aldo-app-icon_9eb86e20\.png$/);
    expect(html).toContain("<title>ALDO Health Care Eco System</title>");
  });
});
