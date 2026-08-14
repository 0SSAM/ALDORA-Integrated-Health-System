export type NotificationScope = {
  organizationId: number | null;
  branchId: number | null;
};

export function canAccessNotificationScope(args: {
  isAdmin: boolean;
  hasActiveOrganizationMembership: boolean;
  requestedOrganizationId?: number | null;
  notification: NotificationScope;
}) {
  if (args.notification.branchId !== null) return false;
  if (args.isAdmin) return true;
  if (!args.hasActiveOrganizationMembership) return false;
  if (args.notification.organizationId === null) return true;
  return args.requestedOrganizationId === args.notification.organizationId;
}
