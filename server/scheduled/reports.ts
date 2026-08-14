import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { reportDefinitions, reportRuns } from "../../drizzle/schema";
import { getDb } from "../db";
import { sdk } from "../_core/sdk";

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

    const periodEnd = new Date();
    const periodStart = new Date(periodEnd.getTime() - 24 * 60 * 60 * 1000);
    const idempotencyKey = `${taskUid}:${periodEnd.toISOString().slice(0, 10)}`;
    const existing = (await db.select({ id: reportRuns.id, status: reportRuns.status }).from(reportRuns).where(eq(reportRuns.idempotencyKey, idempotencyKey)).limit(1))[0];
    if (existing) return res.json({ ok: true, skipped: "duplicate", runId: existing.id, status: existing.status });

    const inserted = await db.insert(reportRuns).values({
      definitionId: definition.id,
      organizationId: definition.organizationId,
      jurisdictionId: definition.jurisdictionId,
      idempotencyKey,
      periodStart,
      periodEnd,
      status: "skipped",
      outputRef: definition.queryKey,
      errorCode: "REPORT_QUERY_EXECUTION_NOT_IMPLEMENTED",
      startedAt: periodEnd,
      finishedAt: new Date(),
    });

    return res.json({ ok: true, runId: Number(inserted[0].insertId), status: "skipped", reason: "report-query-execution-not-implemented", delivery: "disabled" });
  } catch (error) {
    return res.status(500).json({ error: String(error), context: { url: req.originalUrl, taskUid }, timestamp: new Date().toISOString() });
  }
}
