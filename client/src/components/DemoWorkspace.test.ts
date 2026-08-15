import { describe, expect, it } from "vitest";
import { clampDemoDiscount, filterDemoCatalog } from "./DemoWorkspace";

describe("interactive demo safety helpers", () => {
  it("caps the simulated discount at the policy demonstration limit", () => {
    expect(clampDemoDiscount("12")).toBe(7);
    expect(clampDemoDiscount("-4")).toBe(0);
    expect(clampDemoDiscount("invalid")).toBe(0);
  });

  it("searches only the explicitly local synthetic catalog", () => {
    expect(filterDemoCatalog("MED-001")).toHaveLength(1);
    expect(filterDemoCatalog("paracetamol")[0]?.item.id).toBe("MED-001");
    expect(filterDemoCatalog("عرض تجريبي")).toHaveLength(3);
    expect(filterDemoCatalog("not-a-real-record")).toHaveLength(0);
  });
});
