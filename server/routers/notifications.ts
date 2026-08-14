import { and, desc, eq, gt, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import { notificationReads, notifications, organizationMemberships } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { canViewNotification } from "../domain/notifications-policy";
import { summarizeNotifications } from "../domain/notifications-view";
import { adminProcedure, protectedProcedure, router } from "../_core/trpc";

const notificationInput = z.object({
  organizationId: z.number().int().positive().nullable().optional(),
  branchId: z.number().int().positive().nullable().optional(),
  audienceRole: z.enum(["all", "admin", "manager", "pharmacist", "cashier", "org_admin", "clinical_lead", "operations_manager", "staff", "auditor"]).default("all"),
  severity: z.enum(["info", "success", "warning", "critical"]).default("info"),
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(1000),
  expiresAt: z.date().nullable().optional(),
});

export const notificationsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { items: [], unreadCount: 0 };

    const now = new Date();
    const visibleRole = ctx.user.role;
    const rows = await db.select({
      notification: notifications,
      read: notificationReads.id,
    })
      .from(notifications)
      .leftJoin(notificationReads, and(
        eq(notificationReads.notificationId, notifications.id),
        eq(notificationReads.userId, ctx.user.id),
      ))
      .where(and(
        eq(notifications.active, 1),
        or(isNull(notifications.expiresAt), gt(notifications.expiresAt, now)),
        isNull(notifications.organizationId),
        isNull(notifications.branchId),
        or(eq(notifications.audienceRole, "all"), eq(notifications.audienceRole, visibleRole as typeof notifications.audienceRole.enumValues[number])),
      ))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    const items = rows.filter(row => canViewNotification(row.notification.audienceRole, ctx.user.role)).map(row => ({ ...row.notification, isRead: row.read !== null }));
    return summarizeNotifications(items);
  }),

  markRead: protectedProcedure
    .input(z.object({ notificationId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "قاعدة البيانات غير متاحة حالياً." });
      const visible = await db.select({ id: notifications.id }).from(notifications).where(and(
        eq(notifications.id, input.notificationId),
        eq(notifications.active, 1),
        isNull(notifications.organizationId),
        isNull(notifications.branchId),
      )).limit(1);
      if (!visible.length) throw new TRPCError({ code: "NOT_FOUND", message: "الإشعار غير متاح." });
      await db.insert(notificationReads).values({ notificationId: input.notificationId, userId: ctx.user.id }).onDuplicateKeyUpdate({ set: { readAt: new Date() } });
      return { success: true } as const;
    }),

  create: adminProcedure
    .input(notificationInput)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "قاعدة البيانات غير متاحة حالياً." });
      const [created] = await db.insert(notifications).values({ ...input, createdByUserId: ctx.user.id }).$returningId();
      return { id: created.id };
    }),

  listForOrganization: protectedProcedure
    .input(z.object({ organizationId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      if (ctx.user.role !== "admin") {
        const membership = await db.select({ id: organizationMemberships.id }).from(organizationMemberships).where(and(
          eq(organizationMemberships.organizationId, input.organizationId),
          eq(organizationMemberships.userId, ctx.user.id),
          eq(organizationMemberships.active, 1),
        )).limit(1);
        if (!membership.length) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك عضوية في هذه المؤسسة." });
      }
      return db.select().from(notifications).where(and(
        eq(notifications.organizationId, input.organizationId),
        eq(notifications.active, 1),
      )).orderBy(desc(notifications.createdAt)).limit(100);
    }),
});
