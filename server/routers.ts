import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { createDemoToken, demoCookieOptions, DEMO_COOKIE_NAME } from "./_core/demo";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { erpRouter } from "./routers/erp";
import { regionalRouter } from "./routers/regional";
import { organizationsRouter } from "./routers/organizations";
import { notificationsRouter } from "./routers/notifications";
import { reportsRouter } from "./routers/reports";
import { insuranceRouter } from "./routers/insurance";
import { promotionsRouter } from "./routers/promotions";
import { getInternalCredentialByUsername, getInternalScopeForUser, createInternalSession, recordAuthenticationEvent, revokeInternalSession } from "./db";
import { createInternalSessionToken, INTERNAL_LOCKOUT_MS, INTERNAL_MAX_FAILED_ATTEMPTS, INTERNAL_SESSION_COOKIE, INTERNAL_SESSION_TTL_MS, isLocked, normalizeInternalUsername, verifyInternalPassword } from "./domain/internal-auth";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    internalLogin: publicProcedure.input(z.object({ username: z.string().min(3).max(80), password: z.string().min(1).max(200) })).mutation(async ({ ctx, input }) => {
      const username = normalizeInternalUsername(input.username);
      const credential = await getInternalCredentialByUsername(username);
      const now = new Date();
      const invalid = () => ({ success: false as const, message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      if (!credential || !credential.active || isLocked(credential.lockedUntil, now) || !verifyInternalPassword(input.password, credential.passwordHash)) {
        if (credential) {
          const nextAttempts = credential.failedAttempts + 1;
          const shouldLock = nextAttempts >= INTERNAL_MAX_FAILED_ATTEMPTS;
          const db = await (await import("./db")).getDb();
          if (db) {
            const { internalCredentials } = await import("../drizzle/schema");
            const { eq } = await import("drizzle-orm");
            await db.update(internalCredentials).set({ failedAttempts: shouldLock ? 0 : nextAttempts, lockedUntil: shouldLock ? new Date(now.getTime() + INTERNAL_LOCKOUT_MS) : null }).where(eq(internalCredentials.id, credential.id));
          }
          await recordAuthenticationEvent({ username, userId: credential.userId, eventType: shouldLock ? "lockout" : "login_failure", source: "internal" });
        } else {
          await recordAuthenticationEvent({ username, eventType: "login_failure", source: "internal" });
        }
        return invalid();
      }
      const scope = await getInternalScopeForUser(credential.userId);
      if (!scope) {
        await recordAuthenticationEvent({ username, userId: credential.userId, eventType: "login_failure", source: "internal" });
        return invalid();
      }
      const token = createInternalSessionToken();
      await createInternalSession({ token, userId: credential.userId, ...scope, expiresAt: new Date(now.getTime() + INTERNAL_SESSION_TTL_MS) });
      await recordAuthenticationEvent({ username, userId: credential.userId, ...scope, eventType: "login_success", source: "internal" });
      ctx.res.cookie(INTERNAL_SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: ctx.req.secure, maxAge: INTERNAL_SESSION_TTL_MS, path: "/" });
      return { success: true as const, mode: "internal" as const, scope };
    }),
    internalLogout: publicProcedure.mutation(async ({ ctx }) => {
      const token = ctx.req.cookies?.[INTERNAL_SESSION_COOKIE];
      if (token) await revokeInternalSession(token);
      ctx.res.clearCookie(INTERNAL_SESSION_COOKIE, { httpOnly: true, sameSite: "lax", secure: ctx.req.secure, maxAge: 0, path: "/" });
      return { success: true as const };
    }),
    startDemo: publicProcedure.mutation(({ ctx }) => {
      ctx.res.cookie(DEMO_COOKIE_NAME, createDemoToken(), demoCookieOptions(ctx.req));
      return { success: true, mode: "demo" as const };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      if (ctx.req.cookies?.[DEMO_COOKIE_NAME]) {
        ctx.res.clearCookie(DEMO_COOKIE_NAME, { ...demoCookieOptions(ctx.req), maxAge: 0 });
      }
      return { success: true } as const;
    }),
  }),
  erp: erpRouter,
  regional: regionalRouter,
  organizations: organizationsRouter,
  notifications: notificationsRouter,
  reports: reportsRouter,
  insurance: insuranceRouter,
  promotions: promotionsRouter,
});

export type AppRouter = typeof appRouter;
