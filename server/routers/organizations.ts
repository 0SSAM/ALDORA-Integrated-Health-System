import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { organizationMemberships, organizations, users } from "../../drizzle/schema";
import { getDb } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { canManageOrganization, canViewOrganizationAudit } from "../domain/organization-access";

const organizationTypeSchema = z.enum([
  "government",
  "pharmacy",
  "pharmacy_chain",
  "distributor",
  "insurer",
  "rehabilitation",
  "hospital",
  "laboratory",
  "radiology",
]);

export const organizationsRouter = router({
  mine: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    if (ctx.user.role === "admin") {
      return db.select().from(organizations).where(eq(organizations.status, "active"));
    }
    return db
      .select({
        id: organizations.id,
        organizationType: organizations.organizationType,
        displayName: organizations.displayName,
        countryCode: organizations.countryCode,
        status: organizations.status,
        organizationRole: organizationMemberships.organizationRole,
      })
      .from(organizationMemberships)
      .innerJoin(organizations, eq(organizations.id, organizationMemberships.organizationId))
      .where(and(eq(organizationMemberships.userId, ctx.user.id), eq(organizationMemberships.active, 1), eq(organizations.status, "active")));
  }),

  get: protectedProcedure.input(z.object({ organizationId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Database unavailable" });
    const organization = (await db.select().from(organizations).where(eq(organizations.id, input.organizationId)).limit(1))[0];
    if (!organization) throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });
    if (ctx.user.role !== "admin") {
      const membership = (await db.select().from(organizationMemberships).where(and(eq(organizationMemberships.organizationId, input.organizationId), eq(organizationMemberships.userId, ctx.user.id), eq(organizationMemberships.active, 1))).limit(1))[0];
      if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "Organization access denied" });
      return { ...organization, organizationRole: membership.organizationRole };
    }
    return { ...organization, organizationRole: "platform_admin" as const };
  }),

  create: protectedProcedure.input(z.object({
    organizationType: organizationTypeSchema,
    legalName: z.string().min(2).max(240),
    displayName: z.string().min(2).max(240),
    countryCode: z.string().regex(/^[A-Z]{2,3}$/),
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Platform administration permission required" });
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Database unavailable" });
    const result = await db.insert(organizations).values({ ...input, status: "pending" });
    return { id: Number(result[0].insertId), status: "pending" as const };
  }),

  members: protectedProcedure.input(z.object({ organizationId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Database unavailable" });
    if (ctx.user.role !== "admin") {
      const memberships = await db.select().from(organizationMemberships).where(and(eq(organizationMemberships.userId, ctx.user.id), eq(organizationMemberships.active, 1)));
      const canReadDirectory = canManageOrganization(ctx.user.role, memberships, input.organizationId) || canViewOrganizationAudit(ctx.user.role, memberships, input.organizationId);
      if (!canReadDirectory) throw new TRPCError({ code: "FORBIDDEN", message: "Organization member directory access denied" });
    }
    return db.select({ userId: users.id, name: users.name, email: users.email, organizationRole: organizationMemberships.organizationRole, active: organizationMemberships.active }).from(organizationMemberships).innerJoin(users, eq(users.id, organizationMemberships.userId)).where(eq(organizationMemberships.organizationId, input.organizationId));
  }),

  setMembership: protectedProcedure.input(z.object({ organizationId: z.number().int().positive(), userId: z.number().int().positive(), organizationRole: z.enum(["owner", "org_admin", "compliance_officer", "clinical_lead", "operations_manager", "staff", "auditor"]), active: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Database unavailable" });
    if (ctx.user.role !== "admin") {
      const memberships = await db.select().from(organizationMemberships).where(and(eq(organizationMemberships.userId, ctx.user.id), eq(organizationMemberships.active, 1)));
      if (!canManageOrganization(ctx.user.role, memberships, input.organizationId)) throw new TRPCError({ code: "FORBIDDEN", message: "Organization management permission required" });
    }
    const existing = (await db.select().from(organizationMemberships).where(and(eq(organizationMemberships.organizationId, input.organizationId), eq(organizationMemberships.userId, input.userId))).limit(1))[0];
    if (existing) {
      await db.update(organizationMemberships).set({ organizationRole: input.organizationRole, active: input.active ? 1 : 0 }).where(eq(organizationMemberships.id, existing.id));
      return { id: existing.id, updated: true };
    }
    const result = await db.insert(organizationMemberships).values({ organizationId: input.organizationId, userId: input.userId, organizationRole: input.organizationRole, active: input.active ? 1 : 0 });
    return { id: Number(result[0].insertId), updated: false };
  }),

  assertManager: protectedProcedure.input(z.object({ organizationId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Database unavailable" });
    if (ctx.user.role === "admin") return { allowed: true };
    const memberships = await db.select().from(organizationMemberships).where(and(eq(organizationMemberships.userId, ctx.user.id), eq(organizationMemberships.active, 1)));
    return { allowed: canManageOrganization(ctx.user.role, memberships, input.organizationId) };
  }),
});
