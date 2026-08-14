import { createHash } from "node:crypto";
import { assertInsuranceTransition, type InsuranceRequestStatus } from "./insurance-policy";

export function hashInsuranceMemberReference(value: string): string {
  const normalized = value.trim();
  if (normalized.length < 2) throw new Error("Member reference is required");
  return createHash("sha256").update(normalized).digest("hex");
}

export function buildInsuranceRequestPayload(serviceCode: string): string {
  const normalized = serviceCode.trim();
  if (!normalized) throw new Error("Service code is required");
  return JSON.stringify({ serviceCode: normalized });
}

export function assertPersistedInsuranceTransition(from: InsuranceRequestStatus, to: InsuranceRequestStatus, credentialGate: "NOT_CONFIGURED" | "TEST_READY" | "PRODUCTION_READY"): true {
  assertInsuranceTransition(from, to);
  if (to === "SUBMITTED" && credentialGate !== "PRODUCTION_READY") throw new Error("Live payer submission is disabled until production credentials are ready");
  return true;
}
