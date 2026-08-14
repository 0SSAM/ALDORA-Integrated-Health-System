import { describe, expect, it } from "vitest";
import { activeCatalogFields, assertCatalogEvidence, canApproveCatalogItem, missingCatalogEvidence } from "./catalog-policy";

describe("catalog evidence policy", () => {
  it("requires registration evidence for medicines", () => {
    const evidence = ["nameAr", "category", "sku"].map(catalogField => ({ catalogField, verificationStatus: "verified" as const }));
    expect(missingCatalogEvidence("medicine", evidence)).toEqual(["registrationNumber"]);
    expect(canApproveCatalogItem("medicine", evidence)).toBe(false);
  });

  it("accepts a fully evidenced cosmetic item", () => {
    const evidence = ["nameAr", "category", "sku"].map(catalogField => ({ catalogField, verificationStatus: "verified" as const }));
    expect(canApproveCatalogItem("cosmetic", evidence)).toBe(true);
    expect(assertCatalogEvidence("cosmetic", evidence)).toBe(true);
  });

  it("requires every active catalog field and pack-specific field to have evidence", () => {
    const item = { nameAr: "دواء", category: "medicine", sku: "SKU-1", manufacturer: "Manufacturer", sourceAuthority: "Official Authority" };
    const fields = activeCatalogFields(item, "medicine");
    expect(fields).toContain("manufacturer");
    expect(missingCatalogEvidence("medicine", [{ catalogField: "nameAr", verificationStatus: "verified" }], ["manufacturer"])).toContain("manufacturer");
    expect(() => assertCatalogEvidence("medicine", fields.map(catalogField => ({ catalogField, verificationStatus: "verified" as const })), ["countrySpecificRegistrationField"])).toThrow("countrySpecificRegistrationField");
  });

  it("does not count review evidence as verified", () => {
    const evidence = ["nameAr", "category", "sku"].map(catalogField => ({ catalogField, verificationStatus: "review" as const }));
    expect(() => assertCatalogEvidence("medical_supply", evidence)).toThrow("Missing verified catalog evidence");
  });
});
