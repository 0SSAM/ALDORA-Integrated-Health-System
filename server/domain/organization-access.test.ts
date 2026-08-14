import { describe, expect, it } from "vitest";
import {
  canAccessOrganization,
  canManageOrganization,
  canViewSensitiveClinicalData,
} from "./organization-access";

const membership = { organizationId: 7, active: 1, organizationRole: "clinical_lead" };

describe("organization access policy", () => {
  it("allows an active member to access only their organization", () => {
    expect(canAccessOrganization("user", [membership], 7)).toBe(true);
    expect(canAccessOrganization("user", [membership], 8)).toBe(false);
  });

  it("rejects inactive memberships", () => {
    expect(canAccessOrganization("user", [{ ...membership, active: 0 }], 7)).toBe(false);
  });

  it("keeps platform admin governance separate from organization membership", () => {
    expect(canAccessOrganization("admin", [], 99)).toBe(true);
    expect(canManageOrganization("admin", [], 99)).toBe(true);
  });

  it("does not grant clinical-data access to an operations-only member", () => {
    const operationsMembership = { organizationId: 7, active: 1, organizationRole: "operations_manager" };
    expect(canViewSensitiveClinicalData("manager", [operationsMembership], 7)).toBe(false);
    expect(canViewSensitiveClinicalData("manager", [membership], 7)).toBe(true);
  });
});
