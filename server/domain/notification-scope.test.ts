import { describe, expect, it } from "vitest";
import { canAccessNotificationScope } from "./notification-scope";

describe("notification scope policy", () => {
  it("allows global notifications to a member", () => {
    expect(canAccessNotificationScope({
      isAdmin: false,
      hasActiveOrganizationMembership: true,
      requestedOrganizationId: 9,
      notification: { organizationId: null, branchId: null },
    })).toBe(true);
  });

  it("allows organization notifications only for the matching active membership", () => {
    expect(canAccessNotificationScope({
      isAdmin: false,
      hasActiveOrganizationMembership: true,
      requestedOrganizationId: 9,
      notification: { organizationId: 9, branchId: null },
    })).toBe(true);
    expect(canAccessNotificationScope({
      isAdmin: false,
      hasActiveOrganizationMembership: true,
      requestedOrganizationId: 10,
      notification: { organizationId: 9, branchId: null },
    })).toBe(false);
  });

  it("rejects inactive or branch-scoped access from this organization-wide policy", () => {
    expect(canAccessNotificationScope({
      isAdmin: false,
      hasActiveOrganizationMembership: false,
      requestedOrganizationId: 9,
      notification: { organizationId: 9, branchId: null },
    })).toBe(false);
    expect(canAccessNotificationScope({
      isAdmin: true,
      hasActiveOrganizationMembership: false,
      requestedOrganizationId: 9,
      notification: { organizationId: 9, branchId: 4 },
    })).toBe(false);
  });
});
