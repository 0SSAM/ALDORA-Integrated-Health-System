import { TRPCError } from "@trpc/server";
import { parse as parseCookie } from "cookie";
import { and, desc, eq, like } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { prescriptionIntakes, scheduledJobs, customerProfiles, careInteractions, callTickets, catalogItems, catalogSyncQueue, complianceEvidence, compliancePacks, jurisdictionProfiles, branchJurisdictions, inventoryBatches, products, sales, saleItems } from "../../drizzle/schema";
import { getDb } from "../db";
import { createHeartbeatJob } from "../_core/heartbeat";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { protectedProcedure, router } from "../_core/trpc";
import { enforceDiscount, selectFefoBatches, type AppRole } from "../domain/rules";
import { assertPrescriptionConfirmed, preparePosSale, validatePrescriptionUpload } from "../domain/erp";
import { assertCompliancePackUsable, assertJurisdictionProfileReady } from "../domain/regional-engine";
import { assertBranchAssignmentReady } from "../domain/branch-compliance";
import { storageGetSignedUrl, storagePut } from "../storage";
import { activeCatalogFields, assertCatalogEvidence } from "../domain/catalog-policy";
import { assertRecordBelongsToJurisdiction } from "../domain/data-boundary";

const pharmacistProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.user.role as AppRole;
  if (!["admin", "manager", "pharmacist"].includes(role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Pharmacist review permission required" });
  }
  return next();
});

const catalogEditorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!["admin", "manager", "pharmacist"].includes(ctx.user.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Catalog editor permission required" });
  }
  return next();
});

const customerCareProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!["admin", "manager", "pharmacist", "cashier"].includes(ctx.user.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Customer care permission required" });
  }
  return next();
});

export const erpRouter = router({
  policy: router({
    validateDiscount: protectedProcedure
      .input(z.object({ officialPrice: z.number().nonnegative(), discountAmount: z.number().nonnegative() }))
      .query(({ input }) => enforceDiscount(input.officialPrice, input.discountAmount)),
    planFefo: protectedProcedure
      .input(z.object({ requestedQuantity: z.number().positive(), batches: z.array(z.object({ id: z.string(), jurisdictionId: z.number().int().positive(), expiryDate: z.coerce.date(), quantityOnHand: z.number().nonnegative() })) }))
      .query(({ input }) => selectFefoBatches(input.batches, input.requestedQuantity)),
  }),
  pos: router({
    prepareSale: protectedProcedure
      .input(z.object({ branchId: z.number().int().positive(), officialPrice: z.number().nonnegative(), quantity: z.number().positive(), discountAmount: z.number().nonnegative(), batches: z.array(z.object({ id: z.string(), jurisdictionId: z.number().int().positive(), expiryDate: z.coerce.date(), quantityOnHand: z.number().nonnegative() })) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const assignment = (await db.select().from(branchJurisdictions).where(eq(branchJurisdictions.branchId, input.branchId)).limit(1))[0];
        try { assertBranchAssignmentReady(assignment); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        try { input.batches.forEach((batch) => assertRecordBelongsToJurisdiction({ entityType: "inventory_batch", jurisdictionId: batch.jurisdictionId }, assignment.jurisdictionId)); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        const profile = (await db.select().from(jurisdictionProfiles).where(eq(jurisdictionProfiles.id, assignment.jurisdictionId)).limit(1))[0];
        const pack = (await db.select().from(compliancePacks).where(and(eq(compliancePacks.jurisdictionId, assignment.jurisdictionId), eq(compliancePacks.status, "approved"))).orderBy(desc(compliancePacks.createdAt)).limit(1))[0];
        if (!profile || !pack) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Branch jurisdiction or approved compliance pack is unavailable" });
        const evidence = await db.select().from(complianceEvidence).where(and(eq(complianceEvidence.packId, pack.id), eq(complianceEvidence.verificationStatus, "verified")));
        const rules = JSON.parse(pack.rulesJson) as Record<string, boolean>;
        try {
          assertCompliancePackUsable({ countryCode: profile.countryCode, active: profile.active === 1, legalAuthorityProfile: profile.legalAuthorityProfile, language: profile.language, defaultLocale: profile.defaultLocale, currencyCode: profile.currencyCode, timezone: profile.timezone, taxProfile: profile.taxProfile, dateFormat: profile.dateFormat, numberSystem: profile.numberSystem }, { jurisdictionId: pack.jurisdictionId, packVersion: pack.packVersion, status: pack.status, effectiveFrom: pack.effectiveFrom, reviewDueAt: pack.reviewDueAt, rules, evidenceCount: evidence.length }, "sale");
        } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        try { return { ...preparePosSale(input), jurisdictionId: assignment.jurisdictionId }; } catch (error) { throw new TRPCError({ code: "BAD_REQUEST", message: String(error) }); }
      }),
    commitSale: protectedProcedure
      .input(z.object({ branchId: z.number().int().positive(), invoiceNumber: z.string().min(3).max(80), paymentMethod: z.enum(["cash", "meeza", "instapay", "insurance"]), discountAmount: z.number().nonnegative(), items: z.array(z.object({ productId: z.number().int().positive(), batchId: z.number().int().positive(), quantity: z.number().positive(), unit: z.string().min(1).max(24), unitPrice: z.number().nonnegative() })).min(1) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const assignment = (await db.select().from(branchJurisdictions).where(eq(branchJurisdictions.branchId, input.branchId)).limit(1))[0];
        try { assertBranchAssignmentReady(assignment); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        const profile = (await db.select().from(jurisdictionProfiles).where(eq(jurisdictionProfiles.id, assignment.jurisdictionId)).limit(1))[0];
        const pack = (await db.select().from(compliancePacks).where(and(eq(compliancePacks.jurisdictionId, assignment.jurisdictionId), eq(compliancePacks.status, "approved"))).orderBy(desc(compliancePacks.createdAt)).limit(1))[0];
        const evidence = pack ? await db.select().from(complianceEvidence).where(and(eq(complianceEvidence.packId, pack.id), eq(complianceEvidence.verificationStatus, "verified"))) : [];
        if (!profile || !pack) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Approved current sale compliance pack required" });
        try { assertCompliancePackUsable({ countryCode: profile.countryCode, active: profile.active === 1, legalAuthorityProfile: profile.legalAuthorityProfile, language: profile.language, defaultLocale: profile.defaultLocale, currencyCode: profile.currencyCode, timezone: profile.timezone, taxProfile: profile.taxProfile, dateFormat: profile.dateFormat, numberSystem: profile.numberSystem }, { jurisdictionId: pack.jurisdictionId, packVersion: pack.packVersion, status: pack.status, effectiveFrom: pack.effectiveFrom, reviewDueAt: pack.reviewDueAt, rules: JSON.parse(pack.rulesJson) as Record<string, boolean>, evidenceCount: evidence.length }, "sale"); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const discount = enforceDiscount(subtotal, input.discountAmount);
        if (!discount.allowed) throw new TRPCError({ code: "BAD_REQUEST", message: discount.reason });
        const checkedItems: Array<{ productId: number; batchId: number; quantity: number; unit: string; unitPrice: number; remaining: number }> = [];
        for (const item of input.items) {
          const product = (await db.select().from(products).where(eq(products.id, item.productId)).limit(1))[0];
          const batch = (await db.select().from(inventoryBatches).where(eq(inventoryBatches.id, item.batchId)).limit(1))[0];
          if (!product || !batch || batch.branchId !== input.branchId || batch.productId !== item.productId || batch.jurisdictionId !== assignment.jurisdictionId || product.jurisdictionId !== assignment.jurisdictionId) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Product or batch is outside the branch jurisdiction" });
          const remaining = Number(batch.quantityOnHand);
          if (!Number.isFinite(remaining) || remaining < item.quantity) throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient stock" });
          checkedItems.push({ ...item, remaining });
        }
        try {
          const result = await db.transaction(async (tx) => {
            const inserted = await tx.insert(sales).values({ branchId: input.branchId, jurisdictionId: assignment.jurisdictionId, cashierId: ctx.user.id, invoiceNumber: input.invoiceNumber, subtotal: subtotal.toFixed(2), discountAmount: input.discountAmount.toFixed(2), totalAmount: (subtotal - input.discountAmount).toFixed(2), discountValidation: "MOH_7_PERCENT", paymentMethod: input.paymentMethod, etaStatus: "pending" });
            const saleId = Number(inserted[0].insertId);
            await tx.insert(saleItems).values(checkedItems.map((item) => ({ saleId, productId: item.productId, batchId: item.batchId, unit: item.unit, quantity: item.quantity.toFixed(3), unitPrice: item.unitPrice.toFixed(2) })));
            for (const item of checkedItems) await tx.update(inventoryBatches).set({ quantityOnHand: (item.remaining - item.quantity).toFixed(3) }).where(eq(inventoryBatches.id, item.batchId));
            return saleId;
          });
          return { saleId: result, jurisdictionId: assignment.jurisdictionId, status: "COMMITTED" as const };
        } catch (error) { throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Sale commit failed: ${String(error)}` }); }
      }),
  }),
  schedule: router({
    createDailyInventoryAlerts: protectedProcedure
      .input(z.object({ cron: z.string().regex(/^\d+ \S+ \S+ \S+ \S+ \S+$/).default("0 0 6 * * *") }))
      .mutation(async ({ ctx, input }) => {
        if (!["admin", "manager"].includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN", message: "Only administrators or managers can create schedules" });
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const name = "bdf-inventory-alerts-daily";
        const existing = (await db.select().from(scheduledJobs).where(eq(scheduledJobs.name, name)).limit(1))[0];
        if (existing?.scheduleCronTaskUid) return { taskUid: existing.scheduleCronTaskUid, reused: true };
        const session = parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";
        const job = await createHeartbeatJob({ name, cron: input.cron, path: "/api/scheduled/inventory-alerts", method: "POST", description: "Daily FEFO reorder and expiry alerts for branch managers" }, session);
        if (existing) await db.update(scheduledJobs).set({ scheduleCronTaskUid: job.taskUid, cronExpression: input.cron, active: 1 }).where(eq(scheduledJobs.id, existing.id));
        else await db.insert(scheduledJobs).values({ name, scheduleCronTaskUid: job.taskUid, cronExpression: input.cron, active: 1 });
        return { taskUid: job.taskUid, nextExecutionAt: job.nextExecutionAt ?? null, reused: false };
      }),
  }),
  prescription: router({
    upload: pharmacistProcedure
      .input(z.object({ branchId: z.number().int().positive(), fileName: z.string().min(1).max(160), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]), dataUrl: z.string().regex(/^data:image\/(jpeg|png|webp);base64,/), }))
      .mutation(async ({ ctx, input }) => {
        const raw = input.dataUrl.split(",", 2)[1] ?? "";
        const bytes = Buffer.from(raw, "base64");
        try { validatePrescriptionUpload({ mimeType: input.mimeType, byteLength: bytes.length }); } catch (error) { throw new TRPCError({ code: "BAD_REQUEST", message: String(error) }); }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const assignment = (await db.select().from(branchJurisdictions).where(eq(branchJurisdictions.branchId, input.branchId)).limit(1))[0];
        try { assertBranchAssignmentReady(assignment); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        const profile = (await db.select().from(jurisdictionProfiles).where(eq(jurisdictionProfiles.id, assignment.jurisdictionId)).limit(1))[0];
        const pack = (await db.select().from(compliancePacks).where(and(eq(compliancePacks.jurisdictionId, assignment.jurisdictionId), eq(compliancePacks.status, "approved"))).orderBy(desc(compliancePacks.createdAt)).limit(1))[0];
        if (!profile || !pack) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Branch requires an approved current jurisdiction pack" });
        const evidence = await db.select().from(complianceEvidence).where(and(eq(complianceEvidence.packId, pack.id), eq(complianceEvidence.verificationStatus, "verified")));
        try { assertCompliancePackUsable({ countryCode: profile.countryCode, active: profile.active === 1, legalAuthorityProfile: profile.legalAuthorityProfile, language: profile.language, defaultLocale: profile.defaultLocale, currencyCode: profile.currencyCode, timezone: profile.timezone, taxProfile: profile.taxProfile, dateFormat: profile.dateFormat, numberSystem: profile.numberSystem }, { jurisdictionId: pack.jurisdictionId, packVersion: pack.packVersion, status: pack.status, effectiveFrom: pack.effectiveFrom, reviewDueAt: pack.reviewDueAt, rules: JSON.parse(pack.rulesJson) as Record<string, boolean>, evidenceCount: evidence.length }, "prescription"); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        const stored = await storagePut(`prescriptions/${ctx.user.id}/${input.fileName}`, bytes, input.mimeType);
        const inserted = await db.insert(prescriptionIntakes).values({ branchId: input.branchId, jurisdictionId: assignment.jurisdictionId, createdByUserId: ctx.user.id, imageKey: stored.key, imageMimeType: input.mimeType, status: "UPLOADED" });
        return { intakeId: Number(inserted[0].insertId), key: stored.key, status: "UPLOADED" as const };
      }),
    extractFromIntake: pharmacistProcedure
      .input(z.object({ intakeId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const intake = (await db.select().from(prescriptionIntakes).where(eq(prescriptionIntakes.id, input.intakeId)).limit(1))[0];
        if (!intake) throw new TRPCError({ code: "NOT_FOUND", message: "Prescription intake not found" });
        const assignment = intake.branchId ? (await db.select().from(branchJurisdictions).where(eq(branchJurisdictions.branchId, intake.branchId)).limit(1))[0] : undefined;
        try { assertBranchAssignmentReady(assignment); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        try { assertRecordBelongsToJurisdiction({ entityType: "prescription", jurisdictionId: intake.jurisdictionId }, assignment.jurisdictionId); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        const profile = (await db.select().from(jurisdictionProfiles).where(eq(jurisdictionProfiles.id, assignment.jurisdictionId)).limit(1))[0];
        const pack = (await db.select().from(compliancePacks).where(and(eq(compliancePacks.jurisdictionId, assignment.jurisdictionId), eq(compliancePacks.status, "approved"))).orderBy(desc(compliancePacks.createdAt)).limit(1))[0];
        const evidence = pack ? await db.select().from(complianceEvidence).where(and(eq(complianceEvidence.packId, pack.id), eq(complianceEvidence.verificationStatus, "verified"))) : [];
        if (!profile || !pack) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Approved current prescription pack required" });
        try { assertCompliancePackUsable({ countryCode: profile.countryCode, active: profile.active === 1, legalAuthorityProfile: profile.legalAuthorityProfile, language: profile.language, defaultLocale: profile.defaultLocale, currencyCode: profile.currencyCode, timezone: profile.timezone, taxProfile: profile.taxProfile, dateFormat: profile.dateFormat, numberSystem: profile.numberSystem }, { jurisdictionId: pack.jurisdictionId, packVersion: pack.packVersion, status: pack.status, effectiveFrom: pack.effectiveFrom, reviewDueAt: pack.reviewDueAt, rules: JSON.parse(pack.rulesJson) as Record<string, boolean>, evidenceCount: evidence.length }, "prescription"); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        const imageUrl = await storageGetSignedUrl(intake.imageKey);
        const result = await invokeLLM({
          model: "gemini-3-flash-preview",
          messages: [{ role: "user", content: [
            { type: "text", text: "اقرأ صورة هذه الوصفة الطبية وفق ملف الدولة المرتبط بالفرع. استخرج النص الدوائي فقط، ولا تخمّن أسماء غير واضحة. أعد ثقة منخفضة عند عدم اليقين. النتائج تحتاج مراجعة صيدلي ولا تمثل قرار صرف." },
            { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
          ] }],
          response_format: {
            type: "json_schema", json_schema: { name: "prescription_extraction", strict: true, schema: { type: "object", properties: { items: { type: "array", items: { type: "object", properties: { detectedText: { type: "string" }, dosage: { type: "string" }, quantity: { type: "string" }, confidence: { type: "number" } }, required: ["detectedText", "dosage", "quantity", "confidence"], additionalProperties: false } }, overallConfidence: { type: "number" }, requiresPharmacistReview: { type: "boolean" } }, required: ["items", "overallConfidence", "requiresPharmacistReview"], additionalProperties: false } },
          },
        });
        const content = result.choices?.[0]?.message?.content;
        if (typeof content !== "string") throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Vision model returned no structured result" });
        const extraction = JSON.parse(content);
        await db.update(prescriptionIntakes).set({ extractionJson: content, status: "PENDING_REVIEW" }).where(eq(prescriptionIntakes.id, intake.id));
        return { intakeId: intake.id, extraction, status: "PENDING_REVIEW" as const, reviewedBy: ctx.user.id };
      }),
    confirm: pharmacistProcedure
      .input(z.object({ intakeId: z.number().int().positive(), approved: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const intake = (await db.select().from(prescriptionIntakes).where(eq(prescriptionIntakes.id, input.intakeId)).limit(1))[0];
        if (!intake) throw new TRPCError({ code: "NOT_FOUND", message: "Prescription intake not found" });
        const status = input.approved ? "CONFIRMED" : "REJECTED";
        await db.update(prescriptionIntakes).set({ status }).where(eq(prescriptionIntakes.id, intake.id));
        return { intakeId: intake.id, status, confirmedBy: ctx.user.id };
      }),
    dispense: pharmacistProcedure
      .input(z.object({ intakeId: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const intake = (await db.select().from(prescriptionIntakes).where(eq(prescriptionIntakes.id, input.intakeId)).limit(1))[0];
        if (!intake) throw new TRPCError({ code: "NOT_FOUND", message: "Prescription intake not found" });
        const assignment = intake.branchId ? (await db.select().from(branchJurisdictions).where(eq(branchJurisdictions.branchId, intake.branchId)).limit(1))[0] : undefined;
        try { assertBranchAssignmentReady(assignment); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        try { assertRecordBelongsToJurisdiction({ entityType: "prescription", jurisdictionId: intake.jurisdictionId }, assignment.jurisdictionId); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        const profile = (await db.select().from(jurisdictionProfiles).where(eq(jurisdictionProfiles.id, assignment.jurisdictionId)).limit(1))[0];
        const pack = (await db.select().from(compliancePacks).where(and(eq(compliancePacks.jurisdictionId, assignment.jurisdictionId), eq(compliancePacks.status, "approved"))).orderBy(desc(compliancePacks.createdAt)).limit(1))[0];
        const evidence = pack ? await db.select().from(complianceEvidence).where(and(eq(complianceEvidence.packId, pack.id), eq(complianceEvidence.verificationStatus, "verified"))) : [];
        if (!profile || !pack) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Approved current dispensing pack required" });
        try { assertCompliancePackUsable({ countryCode: profile.countryCode, active: profile.active === 1, legalAuthorityProfile: profile.legalAuthorityProfile, language: profile.language, defaultLocale: profile.defaultLocale, currencyCode: profile.currencyCode, timezone: profile.timezone, taxProfile: profile.taxProfile, dateFormat: profile.dateFormat, numberSystem: profile.numberSystem }, { jurisdictionId: pack.jurisdictionId, packVersion: pack.packVersion, status: pack.status, effectiveFrom: pack.effectiveFrom, reviewDueAt: pack.reviewDueAt, rules: JSON.parse(pack.rulesJson) as Record<string, boolean>, evidenceCount: evidence.length }, "dispensing"); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        try { assertPrescriptionConfirmed(intake.status); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        return { allowed: true, intakeId: intake.id, nextStep: "CREATE_SALE_WITH_FEFO" as const };
      }),
    extract: pharmacistProcedure
      .input(z.object({ imageUrl: z.string().url().or(z.string().startsWith("data:image/")) }))
      .mutation(async ({ input }) => {
        void input;
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Direct prescription extraction is disabled; use a branch-bound prescription intake" });

      }),
  }),
  customerCare: router({
    list: customerCareProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      return db.select().from(customerProfiles).orderBy(desc(customerProfiles.updatedAt)).limit(100);
    }),
    create: customerCareProcedure
      .input(z.object({ fullName: z.string().min(2).max(220), phone: z.string().min(7).max(40), consentStatus: z.enum(["pending", "granted", "withdrawn"]).default("pending"), chronicCareEnabled: z.boolean().default(false), notes: z.string().max(4000).optional(), branchId: z.number().int().positive().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const inserted = await db.insert(customerProfiles).values({ ...input, chronicCareEnabled: input.chronicCareEnabled ? 1 : 0, createdByUserId: ctx.user.id });
        return { customerId: Number(inserted[0].insertId) };
      }),
    addInteraction: customerCareProcedure
      .input(z.object({ customerId: z.number().int().positive(), interactionType: z.enum(["follow_up", "complaint", "counseling", "chronic_care"]), summary: z.string().min(3).max(6000), nextActionAt: z.coerce.date().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const inserted = await db.insert(careInteractions).values({ ...input, userId: ctx.user.id });
        return { interactionId: Number(inserted[0].insertId) };
      }),
  }),
  callCentre: router({
    list: customerCareProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      return db.select().from(callTickets).orderBy(desc(callTickets.updatedAt)).limit(100);
    }),
    create: customerCareProcedure
      .input(z.object({ subject: z.string().min(2).max(220), channel: z.enum(["phone", "whatsapp", "web", "in_person"]), direction: z.enum(["inbound", "outbound"]), priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"), customerId: z.number().int().positive().optional(), branchId: z.number().int().positive().optional(), callbackAt: z.coerce.date().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const inserted = await db.insert(callTickets).values({ ...input, createdByUserId: ctx.user.id });
        return { ticketId: Number(inserted[0].insertId), status: "open" as const };
      }),
    updateStatus: customerCareProcedure
      .input(z.object({ ticketId: z.number().int().positive(), status: z.enum(["open", "pending", "resolved", "closed"]), disposition: z.string().max(120).optional(), assignedUserId: z.number().int().positive().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        await db.update(callTickets).set(input).where(eq(callTickets.id, input.ticketId));
        return { success: true } as const;
      }),
  }),
  catalog: router({
    search: protectedProcedure
      .input(z.object({ jurisdictionId: z.number().int().positive(), query: z.string().max(120).default(""), category: z.enum(["medicine", "cosmetic", "medical_supply"]).optional() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const profile = (await db.select().from(jurisdictionProfiles).where(eq(jurisdictionProfiles.id, input.jurisdictionId)).limit(1))[0];
        if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Jurisdiction not found" });
        try { assertJurisdictionProfileReady({ countryCode: profile.countryCode, active: profile.active === 1, legalAuthorityProfile: profile.legalAuthorityProfile, language: profile.language, defaultLocale: profile.defaultLocale, currencyCode: profile.currencyCode, timezone: profile.timezone, taxProfile: profile.taxProfile, dateFormat: profile.dateFormat, numberSystem: profile.numberSystem }); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        const filters = [];
        if (input.query) filters.push(like(catalogItems.nameAr, `%${input.query}%`));
        filters.push(eq(catalogItems.jurisdictionId, input.jurisdictionId));
        if (input.category) filters.push(eq(catalogItems.category, input.category));
        return db.select().from(catalogItems).where(and(...filters)).orderBy(desc(catalogItems.updatedAt)).limit(100);
      }),
    createItem: catalogEditorProcedure
      .input(z.object({ jurisdictionId: z.number().int().positive(), category: z.enum(["medicine", "cosmetic", "medical_supply"]), sku: z.string().min(2).max(80), barcode: z.string().max(80).optional(), nameAr: z.string().min(2).max(240), nameEn: z.string().max(240).optional(), genericName: z.string().max(240).optional(), manufacturer: z.string().max(220).optional(), registrationNumber: z.string().max(120).optional(), sourceAuthority: z.string().min(2).max(40), sourceRecordId: z.string().max(160).optional(), sourceUrl: z.string().url().max(500).optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const profile = (await db.select().from(jurisdictionProfiles).where(eq(jurisdictionProfiles.id, input.jurisdictionId)).limit(1))[0];
        if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Jurisdiction not found" });
        try { assertJurisdictionProfileReady({ countryCode: profile.countryCode, active: profile.active === 1, legalAuthorityProfile: profile.legalAuthorityProfile, language: profile.language, defaultLocale: profile.defaultLocale, currencyCode: profile.currencyCode, timezone: profile.timezone, taxProfile: profile.taxProfile, dateFormat: profile.dateFormat, numberSystem: profile.numberSystem }); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        const inserted = await db.insert(catalogItems).values({ ...input, verificationStatus: input.sourceAuthority === "LOCAL_PENDING_REVIEW" ? "PENDING_REVIEW" : "UNVERIFIED", createdByUserId: ctx.user.id, sourceRetrievedAt: new Date() });
        const itemId = Number(inserted[0].insertId);
        await db.insert(catalogSyncQueue).values({ entityType: input.category, operation: "create", entityId: itemId, idempotencyKey: `catalog-create-${itemId}-${ctx.user.id}`, payloadJson: JSON.stringify(input), createdByUserId: ctx.user.id });
        return { itemId, verificationStatus: input.sourceAuthority === "LOCAL_PENDING_REVIEW" ? "PENDING_REVIEW" as const : "UNVERIFIED" as const };
      }),
    approveItem: catalogEditorProcedure
      .input(z.object({ itemId: z.number().int().positive(), approved: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const item = (await db.select().from(catalogItems).where(eq(catalogItems.id, input.itemId)).limit(1))[0];
        if (!item) throw new TRPCError({ code: "NOT_FOUND", message: "Catalog item not found" });
        if (input.approved) {
          if (!item.jurisdictionId) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Catalog item has no jurisdiction" });
          const profile = (await db.select().from(jurisdictionProfiles).where(eq(jurisdictionProfiles.id, item.jurisdictionId)).limit(1))[0];
          if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Jurisdiction not found" });
          try { assertJurisdictionProfileReady({ countryCode: profile.countryCode, active: profile.active === 1, legalAuthorityProfile: profile.legalAuthorityProfile, language: profile.language, defaultLocale: profile.defaultLocale, currencyCode: profile.currencyCode, timezone: profile.timezone, taxProfile: profile.taxProfile, dateFormat: profile.dateFormat, numberSystem: profile.numberSystem }); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
          const pack = (await db.select().from(compliancePacks).where(and(eq(compliancePacks.jurisdictionId, item.jurisdictionId), eq(compliancePacks.status, "approved"))).orderBy(desc(compliancePacks.createdAt)).limit(1))[0];
          if (!pack || pack.effectiveFrom > new Date() || (pack.reviewDueAt && pack.reviewDueAt < new Date())) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Approved current compliance pack required" });
          const verified = await db.select().from(complianceEvidence).where(and(eq(complianceEvidence.packId, pack.id), eq(complianceEvidence.verificationStatus, "verified")));
          const parsedRules = JSON.parse(pack.rulesJson) as Record<string, unknown>;
          const packFields = Array.isArray(parsedRules.catalogRequiredFields) ? parsedRules.catalogRequiredFields.filter((field): field is string => typeof field === "string") : [];
          const activeFields = activeCatalogFields(item, item.category);
          try { assertCatalogEvidence(item.category, verified, [...activeFields, ...packFields]); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        }
        await db.update(catalogItems).set({ verificationStatus: input.approved ? "VERIFIED" : "REJECTED", approvedByUserId: ctx.user.id }).where(eq(catalogItems.id, input.itemId));
        return { itemId: input.itemId, status: input.approved ? "VERIFIED" as const : "REJECTED" as const };
      }),
  }),
});
