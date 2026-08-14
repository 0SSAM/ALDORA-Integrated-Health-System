import { assertSameJurisdiction } from "./regional-engine";

export type JurisdictionBoundRecord = {
  entityType: "product" | "inventory_batch" | "sale" | "prescription" | "catalog_item";
  jurisdictionId: number | null | undefined;
};

export function assertRecordBelongsToJurisdiction(record: JurisdictionBoundRecord, expectedJurisdictionId: number) {
  if (!Number.isInteger(expectedJurisdictionId) || expectedJurisdictionId <= 0) {
    throw new Error("Expected jurisdiction is required");
  }
  if (record.jurisdictionId == null) {
    throw new Error(`${record.entityType} is not jurisdiction-bound`);
  }
  if (record.jurisdictionId !== expectedJurisdictionId) {
    throw new Error(`Cross-country ${record.entityType} access denied`);
  }
  return assertSameJurisdiction(String(record.jurisdictionId), String(expectedJurisdictionId));
}

export function assertRecordsShareJurisdiction(records: JurisdictionBoundRecord[], expectedJurisdictionId: number) {
  records.forEach(record => assertRecordBelongsToJurisdiction(record, expectedJurisdictionId));
  return true as const;
}
