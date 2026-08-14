export type OrganizationMembershipSnapshot = {
  organizationId: number;
  active: number;
  organizationRole: string;
};

export const ORGANIZATION_ROLES = [
  "owner",
  "org_admin",
  "compliance_officer",
  "clinical_lead",
  "operations_manager",
  "staff",
  "auditor",
] as const;

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export function canAccessOrganization(
  userRole: string,
  memberships: OrganizationMembershipSnapshot[],
  organizationId: number,
) {
  if (userRole === "admin") return true;
  return memberships.some(
    membership =>
      membership.organizationId === organizationId &&
      membership.active === 1,
  );
}

export function canManageOrganization(
  userRole: string,
  memberships: OrganizationMembershipSnapshot[],
  organizationId: number,
) {
  if (userRole === "admin") return true;
  return memberships.some(
    membership =>
      membership.organizationId === organizationId &&
      membership.active === 1 &&
      ["owner", "org_admin"].includes(membership.organizationRole),
  );
}

export function canViewSensitiveClinicalData(
  userRole: string,
  memberships: OrganizationMembershipSnapshot[],
  organizationId: number,
) {
  if (userRole === "admin") return true;
  return memberships.some(
    membership =>
      membership.organizationId === organizationId &&
      membership.active === 1 &&
      ["owner", "org_admin", "clinical_lead", "compliance_officer", "auditor"].includes(membership.organizationRole),
  );
}

export function isSupportedOrganizationType(value: string) {
  return [
    "government",
    "pharmacy",
    "pharmacy_chain",
    "distributor",
    "insurer",
    "rehabilitation",
    "hospital",
    "laboratory",
    "radiology",
  ].includes(value);
}
