import { describe, expect, it } from "vitest";
import { assertPrescriptionConfirmed, calculateCompoundingCost, calculateEgyptianPayroll, classifyInsuranceAging, classifyInsuranceClaim, createAuditHash, createCompoundingLiability, deductCompoundingBom, EGYPTIAN_TPA_PROVIDER_CODES, evaluateColdChain, buildLegalLabel, planInventoryAdjustment, preparePosSale, validateAuthorityArtifacts, validateEtaInvoice, validateFinanceEntry, validateInventorySchedulePolicy, validatePatientRecord, validatePrescriptionUpload } from "./erp";

describe("ERP domain services", () => {
  it("calculates overtime and Ramadan/night shift metrics", () => {
    const result = calculateEgyptianPayroll({ baseSalary: 10000, hourlyRate: 100, overtimeHours: 4, leaveDays: 0, unpaidLeaveDeduction: 0, shifts: [{ startHour: 22, endHour: 6, hours: 8, isNight: true, isRamadan: false }, { startHour: 10, endHour: 16, hours: 6, isNight: false, isRamadan: true }] });
    expect(result.gross).toBe(10600);
    expect(result.nightHours).toBe(8);
    expect(result.ramadanHours).toBe(6);
  });

  it("validates ETA invoice fields without claiming remote submission", () => {
    expect(validateEtaInvoice({ taxId: "123456789", invoiceNumber: "INV-1", totalAmount: 25 }).valid).toBe(true);
    expect(validateEtaInvoice({ taxId: "bad", invoiceNumber: "", totalAmount: -1 }).errors).toHaveLength(3);
  });

  it("classifies insurance outcomes and exposes 25 provider codes", () => {
    expect(classifyInsuranceClaim({ submittedAmount: 100, approvedAmount: 80 }).status).toBe("PARTIALLY_APPROVED");
    expect(classifyInsuranceClaim({ submittedAmount: 100, rejectionCode: "R1" }).status).toBe("REJECTED");
    expect(EGYPTIAN_TPA_PROVIDER_CODES).toHaveLength(25);
  });

  it("blocks dispensing before pharmacist confirmation", () => {
    expect(() => assertPrescriptionConfirmed("PENDING_REVIEW")).toThrow(/confirmation is required/);
    expect(assertPrescriptionConfirmed("CONFIRMED")).toBe(true);
  });

  it("prepares fractional POS quantity with MOH discount and FEFO allocation", () => {
    const result = preparePosSale({ officialPrice: 100, quantity: 1.5, discountAmount: 10, batches: [{ id: "early", expiryDate: new Date("2026-10-01"), quantityOnHand: 1 }, { id: "late", expiryDate: new Date("2027-01-01"), quantityOnHand: 2 }] });
    expect(result.allocations).toEqual([{ batchId: "early", quantity: 1 }, { batchId: "late", quantity: 0.5 }]);
    expect(result.net).toBe(140);
    expect(() => preparePosSale({ officialPrice: 100, quantity: 1, discountAmount: 7.01, batches: [{ id: "one", expiryDate: new Date("2027-01-01"), quantityOnHand: 1 }] })).toThrow(/MOH/);
  });

  it("covers operational compliance and module boundary rules", () => {
    expect(planInventoryAdjustment([{ id: "b1", expiryDate: new Date("2026-10-01"), quantityOnHand: 2 }], 1, "TRANSFER").allocations[0]?.batchId).toBe("b1");
    expect(classifyInsuranceAging(75)).toBe("61_90");
    expect(evaluateColdChain(5, 2, 8).inRange).toBe(true);
    expect(buildLegalLabel({ productCode: "P1", batchNumber: "B1", expiryDate: "2027-01-01", barcodeValue: "123", qrPayload: "payload" }).verified).toBe(false);
    expect(calculateCompoundingCost([{ quantity: 2, unitCost: 10 }], 5, 10).price).toBe(27.5);
    expect(validateFinanceEntry({ taxAmount: 2, debit: 100, credit: 100 }).balanced).toBe(true);
    expect(validatePatientRecord({ patientCode: "PT-1", consentRecorded: true, chronicCareEnabled: true }).auditable).toBe(true);
  });

  it("covers compounding BOM and authority artifacts", () => {
    expect(deductCompoundingBom([{ componentId: "C1", requiredQuantity: 2, availableQuantity: 3 }])).toEqual([{ componentId: "C1", deductedQuantity: 2 }]);
    expect(() => deductCompoundingBom([{ componentId: "C1", requiredQuantity: 4, availableQuantity: 3 }])).toThrow(/Insufficient/);
    expect(createCompoundingLiability({ batchId: "CMP-1", preparedByUserId: 7, pharmacistApproved: true }).auditable).toBe(true);
    expect(validateAuthorityArtifacts({ authority: "EDA", reference: "EDA-REF", verified: false }).externalVerificationRequired).toBe(true);
    expect(validateAuthorityArtifacts({ authority: "ETA", reference: "ETA-REF", verified: true }).verified).toBe(true);
  });

  it("enforces inventory schedule authorization and path policy", () => {
    expect(validateInventorySchedulePolicy({ role: "manager", path: "/api/scheduled/inventory-alerts", cron: "0 0 6 * * *" })).toBe(true);
    expect(() => validateInventorySchedulePolicy({ role: "cashier", path: "/api/scheduled/inventory-alerts", cron: "0 0 6 * * *" })).toThrow(/Only/);
    expect(() => validateInventorySchedulePolicy({ role: "admin", path: "/api/other", cron: "0 0 6 * * *" })).toThrow(/path/);
  });

  it("rejects invalid prescription uploads", () => {
    expect(() => validatePrescriptionUpload({ mimeType: "application/pdf", byteLength: 100 })).toThrow(/Unsupported/);
    expect(() => validatePrescriptionUpload({ mimeType: "image/png", byteLength: 8 * 1024 * 1024 + 1 })).toThrow(/8MB/);
    expect(validatePrescriptionUpload({ mimeType: "image/png", byteLength: 128 })).toBe(true);
  });

  it("creates deterministic tamper-evident hashes", () => {
    const input = { previousHash: null, actorId: 1, action: "CREATE", entityType: "SALE", entityId: "1", timestamp: 100 };
    expect(createAuditHash(input)).toBe(createAuditHash(input));
  });
});
