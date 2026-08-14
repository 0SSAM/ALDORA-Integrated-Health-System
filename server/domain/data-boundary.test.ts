import { describe, expect, it } from "vitest";
import { assertRecordBelongsToJurisdiction, assertRecordsShareJurisdiction } from "./data-boundary";

describe("jurisdiction data boundary", () => {
  it("accepts records from the same jurisdiction", () => {
    expect(assertRecordsShareJurisdiction([
      { entityType: "product", jurisdictionId: 7 },
      { entityType: "inventory_batch", jurisdictionId: 7 },
      { entityType: "sale", jurisdictionId: 7 },
      { entityType: "prescription", jurisdictionId: 7 },
      { entityType: "catalog_item", jurisdictionId: 7 },
    ], 7)).toBe(true);
  });

  it("rejects cross-country access and unbound legacy records", () => {
    expect(() => assertRecordBelongsToJurisdiction({ entityType: "sale", jurisdictionId: 8 }, 7)).toThrow("Cross-country");
    expect(() => assertRecordBelongsToJurisdiction({ entityType: "prescription", jurisdictionId: null }, 7)).toThrow("not jurisdiction-bound");
  });

  it("rejects an invalid expected jurisdiction", () => {
    expect(() => assertRecordBelongsToJurisdiction({ entityType: "product", jurisdictionId: 1 }, 0)).toThrow("Expected jurisdiction");
  });
});
