import { describe, expect, it } from "vitest";
import { assertSensitiveDataAccess, canAccessSensitiveData } from "./sensitive-data";

const clinicalLead = [{ organizationId: 7, active: 1, organizationRole: "clinical_lead" }];
const operationsManager = [{ organizationId: 7, active: 1, organizationRole: "operations_manager" }];

describe("sensitive data access policy", () => {
  it("allows a clinical lead to view clinical data only in the active organization", () => {
    expect(canAccessSensitiveData({ userRole: "user", memberships: clinicalLead, organizationId: 7, dataType: "prescription", isDemo: false, purpose: "view" })).toBe(true);
    expect(canAccessSensitiveData({ userRole: "user", memberships: clinicalLead, organizationId: 8, dataType: "prescription", isDemo: false, purpose: "view" })).toBe(false);
  });

  it("denies operations-only, demo, and export access", () => {
    expect(canAccessSensitiveData({ userRole: "manager", memberships: operationsManager, organizationId: 7, dataType: "diagnostic", isDemo: false, purpose: "view" })).toBe(false);
    expect(canAccessSensitiveData({ userRole: "user", memberships: clinicalLead, organizationId: 7, dataType: "imaging", isDemo: true, purpose: "view" })).toBe(false);
    expect(canAccessSensitiveData({ userRole: "user", memberships: clinicalLead, organizationId: 7, dataType: "patient", isDemo: false, purpose: "export" })).toBe(false);
  });

  it("separates audit access from clinical access", () => {
    expect(canAccessSensitiveData({ userRole: "user", memberships: clinicalLead, organizationId: 7, dataType: "audit", isDemo: false, purpose: "view" })).toBe(false);
    expect(canAccessSensitiveData({ userRole: "user", memberships: [{ organizationId: 7, active: 1, organizationRole: "auditor" }], organizationId: 7, dataType: "audit", isDemo: false, purpose: "view" })).toBe(true);
  });

  it("throws a stable denial for unauthorized access", () => {
    expect(() => assertSensitiveDataAccess({ userRole: "manager", memberships: operationsManager, organizationId: 7, dataType: "insurance", isDemo: false, purpose: "view" })).toThrow("Sensitive data access denied");
  });
});
