import { describe, expect, it } from "vitest";
import { assertPrescriptionConfirmed, calculateEgyptianPayroll, classifyInsuranceClaim, createAuditHash, EGYPTIAN_TPA_PROVIDER_CODES, preparePosSale, validateEtaInvoice, validatePrescriptionUpload } from "./erp";

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
