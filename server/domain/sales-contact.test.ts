import { describe, expect, it } from "vitest";

describe("sales contact configuration", () => {
  it("uses a WhatsApp web link and does not expose a raw phone or email URI", () => {
    const contactUrl = process.env.VITE_ALDO_SALES_CONTACT_URL ?? "";
    expect(contactUrl).toMatch(/^https:\/\/wa\.me\/201550571454\?text=/);
    expect(contactUrl).not.toMatch(/^(tel:|mailto:)/i);
    expect(contactUrl).not.toContain("+");
  });
});
