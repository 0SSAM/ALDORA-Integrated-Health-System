import { describe, expect, it } from "vitest";
import { normalizeLanguage } from "./LocalizationContext";

describe("language preference", () => {
  it("accepts English and safely falls back to Arabic", () => {
    expect(normalizeLanguage("en")).toBe("en");
    expect(normalizeLanguage("ar")).toBe("ar");
    expect(normalizeLanguage("fr")).toBe("ar");
    expect(normalizeLanguage(null)).toBe("ar");
  });
});
