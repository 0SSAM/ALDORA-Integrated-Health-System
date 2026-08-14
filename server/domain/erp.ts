import { createHash } from "node:crypto";

export type Shift = { startHour: number; endHour: number; hours: number; isNight: boolean; isRamadan: boolean };

export function calculateEgyptianPayroll(input: { baseSalary: number; shifts: Shift[]; overtimeHours: number; hourlyRate: number; leaveDays: number; unpaidLeaveDeduction: number }) {
  const nightHours = input.shifts.filter(shift => shift.isNight).reduce((sum, shift) => sum + shift.hours, 0);
  const ramadanHours = input.shifts.filter(shift => shift.isRamadan).reduce((sum, shift) => sum + shift.hours, 0);
  const overtimePay = Number((input.overtimeHours * input.hourlyRate * 1.5).toFixed(2));
  const gross = Number((input.baseSalary + overtimePay).toFixed(2));
  const net = Number(Math.max(0, gross - input.unpaidLeaveDeduction).toFixed(2));
  return { gross, net, overtimePay, nightHours, ramadanHours, unpaidLeaveDeduction: input.unpaidLeaveDeduction };
}

export function validateEtaInvoice(input: { taxId: string; invoiceNumber: string; totalAmount: number }) {
  const errors: string[] = [];
  if (!/^\d{9}$/.test(input.taxId)) errors.push("ETA tax ID must contain 9 digits");
  if (!input.invoiceNumber.trim()) errors.push("Invoice number is required");
  if (!Number.isFinite(input.totalAmount) || input.totalAmount < 0) errors.push("Invoice total is invalid");
  return { valid: errors.length === 0, errors };
}

export function classifyInsuranceClaim(input: { submittedAmount: number; approvedAmount?: number; rejectionCode?: string }) {
  if (input.rejectionCode) return { status: "REJECTED" as const, outstandingAmount: input.submittedAmount, rejectionCode: input.rejectionCode };
  if (input.approvedAmount === undefined) return { status: "SUBMITTED" as const, outstandingAmount: input.submittedAmount };
  const outstandingAmount = Number(Math.max(0, input.submittedAmount - input.approvedAmount).toFixed(2));
  return { status: outstandingAmount > 0 ? "PARTIALLY_APPROVED" as const : "APPROVED" as const, outstandingAmount };
}

export function createAuditHash(input: { previousHash: string | null; actorId: number | null; action: string; entityType: string; entityId: string | null; timestamp: number }) {
  const payload = JSON.stringify(input);
  return createHash("sha256").update(payload).digest("hex");
}

export const EGYPTIAN_TPA_PROVIDER_CODES = [
  "AXA", "MEDRIGHT", "MASHOUR", "GLORY", "NEXUS", "MISRPOLICY", "ALLIANZ", "METLIFE", "BUPA", "CIGNA", "MUSALLA", "MEDNET", "SAUDI_GERMAN", "ECARE", "HEALTH_INSURANCE_ORG", "UHIA", "NILE_BADR", "WATANIYA", "MISRA_LIFE", "GIG", "PHARMA_CARE", "TPA_23", "TPA_24", "TPA_25", "TPA_26",
] as const;

export function assertPrescriptionConfirmed(status: "UPLOADED" | "PENDING_REVIEW" | "CONFIRMED" | "REJECTED") {
  if (status !== "CONFIRMED") throw new Error("Pharmacist confirmation is required before dispensing");
  return true as const;
}

export function validatePrescriptionUpload(input: { mimeType: string; byteLength: number }) {
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(input.mimeType)) throw new Error("Unsupported prescription image type");
  if (input.byteLength > 8 * 1024 * 1024) throw new Error("Prescription image must be 8MB or smaller");
  return true as const;
}

import { enforceDiscount, selectFefoBatches, type StockBatch } from "./rules";

export function preparePosSale(input: { officialPrice: number; quantity: number; discountAmount: number; batches: StockBatch[] }) {
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) throw new Error("Quantity must be positive");
  const discount = enforceDiscount(input.officialPrice * input.quantity, input.discountAmount);
  if (!discount.allowed) throw new Error("MOH discount cap exceeded");
  const allocations = selectFefoBatches(input.batches, input.quantity);
  return { allocations, gross: Number((input.officialPrice * input.quantity).toFixed(2)), discountAmount: input.discountAmount, net: Number((input.officialPrice * input.quantity - input.discountAmount).toFixed(2)), etaStatus: "pending" as const };
}
