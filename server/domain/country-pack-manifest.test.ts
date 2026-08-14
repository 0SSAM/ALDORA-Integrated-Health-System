import { describe, expect, it } from "vitest";
import manifest from "../../docs/regulatory/country-pack-source-manifest.json";

describe("country pack source manifest", () => {
  it("keeps every reviewed country blocked until activation prerequisites are met", () => {
    expect(manifest.packs.map(pack => pack.country)).toEqual(["EG", "JO", "QA", "MA"]);
    for (const pack of manifest.packs) {
      expect(pack.status).toBe("blocked");
      expect(pack.sources.length).toBeGreaterThan(0);
      expect(pack.activationBlockers.length).toBeGreaterThan(0);
    }
  });
});
