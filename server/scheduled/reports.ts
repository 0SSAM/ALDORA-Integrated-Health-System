import type { Request, Response } from "express";
import { and, eq, gte, lte } from "drizzle-orm";
import { branchJurisdictions, inventoryBatches, reportDefinitions, reportRuns, sales } from "../../drizzle/schema";
import { getDb } from "../db";
import { sdk } from "../_core/sdk";

export type ReportExecutionDefinition = { id: number; status: string; jurisdictionId: number | null; queryKey: string };

export function boundedReportErrorCode(_error: unknown): "REPORT_QUERY_FAILED" {
  return "REPORT_QUERY_FAILED";
}

export function reportExecutionSkipReason(definition: ReportExecutionDefinition): "inactive" | "missing_scope" | "unsupported_query" | undefined {
  if (definition.status !== "active") return "inactive";
  if (definition.jurisdictionId === null) return "missing_scope";
  if (!new Set(["inventory.alerts.v1", "sales.daily.v1", "compliance.expiry.v1", "operations.summary.v1"]).has(definition.queryKey)) return "unsupported_query";
  return undefined;
}

async function executeAllowlistedQuery(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, definition: typeof reportDefinitions.$inferSelect, periodStart: Date, periodEnd: Date) {
  const scopedBatches = await db.select({ id: inventoryBatches.id, quantityOnHand: inventoryBatches.quantityOnHand, reorderPoint: inventoryBatches.reorderPoint, expiryDate: inventoryBatches.expiryDate }).from(inventoryBatches).innerJoin(branchJurisdictions, eq(branchJurisdictions.branchId, inventoryBatches.branchId)).where(and(eq(inventoryBatches.organizationId, definition.organizationId), eq(branchJurisdictions.jurisdictionId, definition.jurisdictionId ?? -1)));
  const scopedSales = await db.select({ id: sales.id, totalAmount: sales.totalAmount }).from(sales).innerJoin(branchJurisdictions, eq(branchJurisdictions.branchId, sales.branchId)).where(and(eq(sales.organizationId, definition.organizationId), eq(branchJurisdictions.jurisdictionId, definition.jurisdictionId ?? -1), gte(sales.createdAt, periodStart), lte(sales.createdAt, periodEnd)));
  const expiring = scopedBatches.filter(row => row.expiryDate >= periodStart && row.expiryDate <= new Date(periodEnd.getTime() + 30 * 86_400_000));
  const reorder = scopedBatches.filter(row => Number(row.quantityOnHand) <= Number(row.reorderPoint));
  if (definition.queryKey === "inventory.alerts.v1") return { queryKey: definition.queryKey, batchesEvaluated: scopedBatches.length, reorderCount: reorder.length, expiringCount: expiring.length };
  if (definition.queryKey === "compliance.expiry.v1") return { queryKey: definition.queryKey, expiringCount: expiring.length, horizonDays: 30 };
  if (definition.queryKey === "sales.daily.v1") return { queryKey: definition.queryKey, salesCount: scopedSales.length, totalAmount: scopedSales.reduce((sum, row) => sum + Number(row.totalAmount), 0) };
  return { queryKey: definition.queryKey, batchesEvaluated: scopedBatches.length, salesCount: scopedSales.length, expiringCount: expiring.length, reorderCount: reorder.length };
}

export async function reportExecutionHandler(req: Request, res: Response) {
  let taskUid: string | undefined;
  try {
    const user = await sdk.authenticateRequest(req);
    taskUid = user.taskUid;
    if (!user.isCron || !taskUid) return res.status(403).json({ error: "cron-only" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "database-unavailable" });

    const definition = (await db.select().from(reportDefinitions).where(eq(reportDefinitions.scheduleCronTaskUid, taskUid)).limit(1))[0];
    if (!definition) return res.json({ ok: true, skipped: "orphan" });
    const skipReason = reportExecutionSkipReason(definition);
    if (skipReason) return res.json({ ok: true, skipped: skipReason, definitionId: definition.id });

    const periodEnd = new Date();
    const periodStart = new Date(periodEnd.getTime() - 24 * 60 * 60 * 1000);
    const idempotencyKey = `${taskUid}:${periodEnd.toISOString().slice(0, 10)}`;
    const existing = (await db.select({ id: reportRuns.id, status: reportRuns.status }).from(reportRuns).where(eq(reportRuns.idempotencyKey, idempotencyKey)).limit(1))[0];
    if (existing) return res.json({ ok: true, skipped: "duplicate", runId: existing.id, status: existing.status });

    let output: Record<string, unknown>;
    try {
      output = await executeAllowlistedQuery(db, definition, periodStart, periodEnd);
    } catch (error) {
      const errorCode = boundedReportErrorCode(error);
      const failed = await db.insert(reportRuns).values({
        definitionId: definition.id,
        organizationId: definition.organizationId,
        jurisdictionId: definition.jurisdictionId,
        idempotencyKey,
        periodStart,
        periodEnd,
        status: "failed",
        errorCode,
        startedAt: periodEnd,
        finishedAt: new Date(),
      });
      return res.status(500).json({ ok: false, error: "report-execution-failed", errorCode, runId: Number(failed[0].insertId) });
    }
    const inserted = await db.insert(reportRuns).values({
      definitionId: definition.id,
      organizationId: definition.organizationId,
      jurisdictionId: definition.jurisdictionId,
      idempotencyKey,
      periodStart,
      periodEnd,
      status: "succeeded",
      outputRef: JSON.stringify(output).slice(0, 500),
      startedAt: periodEnd,
      finishedAt: new Date(),
    });

    return res.json({ ok: true, runId: Number(inserted[0].insertId), status: "succeeded", output, delivery: "disabled" });
  } catch (error) {
    return res.status(500).json({ error: String(error), context: { url: req.originalUrl, taskUid }, timestamp: new Date().toISOString() });
  }
}
