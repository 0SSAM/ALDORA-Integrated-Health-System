import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { branches, branchJurisdictions, organizationMemberships, reportDefinitions, reportRuns } from "../../drizzle/schema";
import { getDb } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

const REPORT_CATALOG = {
  "inventory.alerts": { name: "Inventory alerts", queryKey: "inventory.alerts.v1" },
  "sales.daily": { name: "Daily sales", queryKey: "sales.daily.v1" },
  "compliance.expiry": { name: "Compliance and expiry review", queryKey: "compliance.expiry.v1" },
  "operations.summary": { name: "Operations summary", queryKey: "operations.summary.v1" },
} as const;

const reportKey = z.enum(["inventory.alerts", "sales.daily", "compliance.expiry", "operations.summary"]);
const recipientRole = z.enum(["owner", "org_admin", "compliance_officer", "clinical_lead", "operations_manager", "staff", "auditor"]);

async function accessibleOrganizationIds(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number, role: string) {
  if (role === "admin") return null;
  const rows = await db.select({ organizationId: organizationMemberships.organizationId }).from(organizationMemberships).where(and(eq(organizationMemberships.userId, userId), eq(organizationMemberships.active, 1)));
  return rows.map(row => row.organizationId);
}

async function assertOrganizationAccess(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number, role: string, organizationId: number) {
  const ids = await accessibleOrganizationIds(db, userId, role);
  if (ids !== null && !ids.includes(organizationId)) throw new TRPCError({ code: "FORBIDDEN", message: "Organization is outside the active scope" });
}

export const reportsRouter = router({
  catalog: protectedProcedure.query(() => Object.entries(REPORT_CATALOG).map(([key, value]) => ({ key, ...value, deliveryEnabledByDefault: false }))),

  definitions: protectedProcedure
    .input(z.object({ organizationId: z.number().int().positive(), jurisdictionId: z.number().int().positive().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const ids = await accessibleOrganizationIds(db, ctx.user.id, ctx.user.role);
      const organizationId = input?.organizationId;
      if (organizationId !== undefined) await assertOrganizationAccess(db, ctx.user.id, ctx.user.role, organizationId);
      const filters = [
        ids === null ? undefined : ids.length ? inArray(reportDefinitions.organizationId, ids) : eq(reportDefinitions.id, -1),
        organizationId === undefined ? undefined : eq(reportDefinitions.organizationId, organizationId),
        input?.jurisdictionId === undefined ? undefined : eq(reportDefinitions.jurisdictionId, input.jurisdictionId),
      ].filter(Boolean) as any[];
      return db.select().from(reportDefinitions).where(filters.length ? and(...filters) : undefined).orderBy(desc(reportDefinitions.updatedAt)).limit(100);
    }),

  createDefinition: protectedProcedure
    .input(z.object({ organizationId: z.number().int().positive(), jurisdictionId: z.number().int().positive(), reportKey, name: z.string().min(2).max(180).optional(), description: z.string().max(2000).optional(), cronExpression: z.string().regex(/^\d+ \S+ \S+ \S+ \S+ \S+$/).optional(), recipientUserId: z.number().int().positive().optional(), recipientRole: recipientRole.optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await assertOrganizationAccess(db, ctx.user.id, ctx.user.role, input.organizationId);
      if (ctx.user.role !== "admin") {
        const manager = await db.select({ id: organizationMemberships.id }).from(organizationMemberships).where(and(eq(organizationMemberships.organizationId, input.organizationId), eq(organizationMemberships.userId, ctx.user.id), eq(organizationMemberships.active, 1), inArray(organizationMemberships.organizationRole, ["owner", "org_admin", "compliance_officer", "operations_manager"]))).limit(1);
        if (!manager.length) throw new TRPCError({ code: "FORBIDDEN", message: "Report definition requires organization management access" });
      }
      const jurisdiction = await db.select({ branchId: branches.id }).from(branches).innerJoin(branchJurisdictions, eq(branchJurisdictions.branchId, branches.id)).where(and(eq(branches.organizationId, input.organizationId), eq(branchJurisdictions.jurisdictionId, input.jurisdictionId))).limit(1);
      if (!jurisdiction.length) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Jurisdiction is not configured for this organization" });
      if (input.recipientUserId !== undefined) {
        const recipient = await db.select({ id: organizationMemberships.id }).from(organizationMemberships).where(and(eq(organizationMemberships.organizationId, input.organizationId), eq(organizationMemberships.userId, input.recipientUserId), eq(organizationMemberships.active, 1))).limit(1);
        if (!recipient.length) throw new TRPCError({ code: "FORBIDDEN", message: "Recipient is outside the organization" });
      }
      const selected = REPORT_CATALOG[input.reportKey];
      const inserted = await db.insert(reportDefinitions).values({ organizationId: input.organizationId, jurisdictionId: input.jurisdictionId, reportKey: input.reportKey, name: input.name ?? selected.name, description: input.description, cronExpression: input.cronExpression, status: "draft", queryKey: selected.queryKey, recipientUserId: input.recipientUserId, recipientRole: input.recipientRole, deliveryChannel: "in_app", deliveryEnabled: 0, createdByUserId: ctx.user.id });
      return { definitionId: Number(inserted[0].insertId), status: "draft" as const, deliveryEnabled: false };
    }),

  runs: protectedProcedure
    .input(z.object({ organizationId: z.number().int().positive(), definitionId: z.number().int().positive().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await assertOrganizationAccess(db, ctx.user.id, ctx.user.role, input.organizationId);
      const filters = [eq(reportRuns.organizationId, input.organizationId), input.definitionId === undefined ? undefined : eq(reportRuns.definitionId, input.definitionId)].filter(Boolean) as any[];
      return db.select().from(reportRuns).where(and(...filters)).orderBy(desc(reportRuns.createdAt)).limit(100);
    }),
});
