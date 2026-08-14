import { TRPCError } from "@trpc/server";
import { parse as parseCookie } from "cookie";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { prescriptionIntakes, scheduledJobs } from "../../drizzle/schema";
import { getDb } from "../db";
import { createHeartbeatJob } from "../_core/heartbeat";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { protectedProcedure, router } from "../_core/trpc";
import { enforceDiscount, selectFefoBatches, type AppRole } from "../domain/rules";
import { assertPrescriptionConfirmed, preparePosSale, validatePrescriptionUpload } from "../domain/erp";
import { storageGetSignedUrl, storagePut } from "../storage";

const pharmacistProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.user.role as AppRole;
  if (!["admin", "manager", "pharmacist"].includes(role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Pharmacist review permission required" });
  }
  return next();
});

export const erpRouter = router({
  policy: router({
    validateDiscount: protectedProcedure
      .input(z.object({ officialPrice: z.number().nonnegative(), discountAmount: z.number().nonnegative() }))
      .query(({ input }) => enforceDiscount(input.officialPrice, input.discountAmount)),
    planFefo: protectedProcedure
      .input(z.object({ requestedQuantity: z.number().positive(), batches: z.array(z.object({ id: z.string(), expiryDate: z.coerce.date(), quantityOnHand: z.number().nonnegative() })) }))
      .query(({ input }) => selectFefoBatches(input.batches, input.requestedQuantity)),
  }),
  pos: router({
    prepareSale: protectedProcedure
      .input(z.object({ officialPrice: z.number().nonnegative(), quantity: z.number().positive(), discountAmount: z.number().nonnegative(), batches: z.array(z.object({ id: z.string(), expiryDate: z.coerce.date(), quantityOnHand: z.number().nonnegative() })) }))
      .mutation(({ input }) => {
        try { return preparePosSale(input); } catch (error) { throw new TRPCError({ code: "BAD_REQUEST", message: String(error) }); }
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
      .input(z.object({ fileName: z.string().min(1).max(160), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]), dataUrl: z.string().regex(/^data:image\/(jpeg|png|webp);base64,/), }))
      .mutation(async ({ ctx, input }) => {
        const raw = input.dataUrl.split(",", 2)[1] ?? "";
        const bytes = Buffer.from(raw, "base64");
        try { validatePrescriptionUpload({ mimeType: input.mimeType, byteLength: bytes.length }); } catch (error) { throw new TRPCError({ code: "BAD_REQUEST", message: String(error) }); }
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const stored = await storagePut(`prescriptions/${ctx.user.id}/${input.fileName}`, bytes, input.mimeType);
        const inserted = await db.insert(prescriptionIntakes).values({ createdByUserId: ctx.user.id, imageKey: stored.key, imageMimeType: input.mimeType, status: "UPLOADED" });
        return { intakeId: Number(inserted[0].insertId), key: stored.key, status: "UPLOADED" as const };
      }),
    extractFromIntake: pharmacistProcedure
      .input(z.object({ intakeId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const intake = (await db.select().from(prescriptionIntakes).where(eq(prescriptionIntakes.id, input.intakeId)).limit(1))[0];
        if (!intake) throw new TRPCError({ code: "NOT_FOUND", message: "Prescription intake not found" });
        const imageUrl = await storageGetSignedUrl(intake.imageKey);
        const result = await invokeLLM({
          model: "gemini-3-flash-preview",
          messages: [{ role: "user", content: [
            { type: "text", text: "اقرأ صورة هذه الوصفة الطبية المصرية. استخرج النص الدوائي فقط، ولا تخمّن أسماء غير واضحة. أعد ثقة منخفضة عند عدم اليقين. النتائج تحتاج مراجعة صيدلي ولا تمثل قرار صرف." },
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
        try { assertPrescriptionConfirmed(intake.status); } catch (error) { throw new TRPCError({ code: "PRECONDITION_FAILED", message: String(error) }); }
        return { allowed: true, intakeId: intake.id, nextStep: "CREATE_SALE_WITH_FEFO" as const };
      }),
    extract: pharmacistProcedure
      .input(z.object({ imageUrl: z.string().url().or(z.string().startsWith("data:image/")) }))
      .mutation(async ({ input }) => {
        const result = await invokeLLM({
          model: "gemini-3-flash-preview",
          messages: [{ role: "user", content: [
            { type: "text", text: "اقرأ صورة هذه الوصفة الطبية المصرية. استخرج النص الدوائي فقط، ولا تخمّن أسماء غير واضحة. أعد ثقة منخفضة عند عدم اليقين. النتائج تحتاج مراجعة صيدلي ولا تمثل قرار صرف." },
            { type: "image_url", image_url: { url: input.imageUrl, detail: "high" } },
          ] }],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "prescription_extraction",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  items: { type: "array", items: { type: "object", properties: { detectedText: { type: "string" }, dosage: { type: "string" }, quantity: { type: "string" }, confidence: { type: "number" } }, required: ["detectedText", "dosage", "quantity", "confidence"], additionalProperties: false } },
                  overallConfidence: { type: "number" },
                  requiresPharmacistReview: { type: "boolean" },
                },
                required: ["items", "overallConfidence", "requiresPharmacistReview"],
                additionalProperties: false,
              },
            },
          },
        });
        const content = result.choices?.[0]?.message?.content;
        if (typeof content !== "string") throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Vision model returned no structured result" });
        return { extraction: JSON.parse(content), status: "PENDING_REVIEW" as const, model: "gemini-3-flash-preview" };
      }),
  }),
});
