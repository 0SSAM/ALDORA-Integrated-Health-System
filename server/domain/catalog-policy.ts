export type CatalogCategory = "medicine" | "cosmetic" | "medical_supply";

export type CatalogEvidenceRecord = {
  catalogField: string | null;
  verificationStatus: "unverified" | "review" | "verified" | "rejected";
};

export function requiredCatalogEvidenceFields(category: CatalogCategory, additionalFields: string[] = []) {
  return Array.from(new Set(["nameAr", "category", "sku", ...(category === "medicine" ? ["registrationNumber"] : []), ...additionalFields]));
}

export function activeCatalogFields(item: Record<string, unknown>, category: CatalogCategory) {
  const fields = ["nameAr", "category", "sku", "barcode", "nameEn", "genericName", "manufacturer", "registrationNumber", "sourceAuthority", "sourceRecordId", "sourceUrl"];
  return fields.filter(field => item[field] !== null && item[field] !== undefined && String(item[field]).trim() !== "");
}

export function missingCatalogEvidence(category: CatalogCategory, evidence: CatalogEvidenceRecord[], additionalFields: string[] = []) {
  const verifiedFields = new Set(evidence.filter(item => item.verificationStatus === "verified" && item.catalogField).map(item => item.catalogField));
  return requiredCatalogEvidenceFields(category, additionalFields).filter(field => !verifiedFields.has(field));
}

export function canApproveCatalogItem(category: CatalogCategory, evidence: CatalogEvidenceRecord[], additionalFields: string[] = []) {
  return missingCatalogEvidence(category, evidence, additionalFields).length === 0;
}

export function assertCatalogEvidence(category: CatalogCategory, evidence: CatalogEvidenceRecord[], additionalFields: string[] = []) {
  const missing = missingCatalogEvidence(category, evidence, additionalFields);
  if (missing.length) throw new Error(`Missing verified catalog evidence: ${missing.join(", ")}`);
  return true as const;
}
