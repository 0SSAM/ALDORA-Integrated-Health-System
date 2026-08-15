import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions, isSecureRequest } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { clearNlmIcd10Cache, getNlmIcd10CacheStats, searchNlmIcd10Cm } from "./domain/nlm-icd10";
import { erpRouter } from "./routers/erp";
import { regionalRouter } from "./routers/regional";
import { organizationsRouter } from "./routers/organizations";
import { notificationsRouter } from "./routers/notifications";
import { reportsRouter } from "./routers/reports";
import { insuranceRouter } from "./routers/insurance";
import { promotionsRouter } from "./routers/promotions";
import { egyptHealthcareRouter } from "./routers/egypt-healthcare";
import { createPasswordResetToken, getInternalCredentialByUsername, getInternalScopeForUser, createInternalSession, recordAuthenticationEvent, resetInternalPasswordWithToken, revokeInternalSession } from "./db";
import { assertPasswordPolicy, createInternalSessionToken, INTERNAL_LOCKOUT_MS, INTERNAL_MAX_FAILED_ATTEMPTS, INTERNAL_SESSION_COOKIE, INTERNAL_SESSION_TTL_MS, isLocked, normalizeInternalUsername, verifyInternalPassword } from "./domain/internal-auth";
import { hashInternalPassword } from "./domain/internal-auth";

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
      await createInternalSession({ token, userId: credential.userId, ...scope, sessionMode: credential.accountType === "showcase" ? "showcase" : "production", expiresAt: new Date(now.getTime() + INTERNAL_SESSION_TTL_MS) });
      await recordAuthenticationEvent({ username, userId: credential.userId, ...scope, eventType: "login_success", source: "internal" });
      ctx.res.cookie(INTERNAL_SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: isSecureRequest(ctx.req), maxAge: INTERNAL_SESSION_TTL_MS, path: "/" });
      return { success: true as const, mode: "internal" as const, scope, accountType: credential.accountType, sessionMode: credential.accountType === "showcase" ? "showcase" as const : "production" as const };
    }),
    requestPasswordReset: publicProcedure.input(z.object({ username: z.string().min(3).max(80) })).mutation(async ({ input }) => {
      const generic = { success: true as const, message: "إذا كانت بيانات الحساب صحيحة، فسيتم إرسال تعليمات الاستعادة عبر قناة المؤسسة المعتمدة." };
      let username: string;
      try { username = normalizeInternalUsername(input.username); } catch { return generic; }
      const credential = await getInternalCredentialByUsername(username);
      if (!credential || !credential.active) {
        await recordAuthenticationEvent({ username, eventType: "password_reset_requested", source: "internal" });
        return generic;
      }
      const token = createInternalSessionToken();
      await createPasswordResetToken({ userId: credential.userId, credentialId: credential.id, token, expiresAt: new Date(Date.now() + 30 * 60 * 1000) });
      await recordAuthenticationEvent({ username, userId: credential.userId, eventType: "password_reset_requested", source: "internal" });
      // Token delivery is intentionally not returned to the browser. A verified email/OTP adapter must be configured before production delivery.
      return generic;
    }),
    resetPassword: publicProcedure.input(z.object({ token: z.string().min(32).max(200), password: z.string().min(12).max(200), confirmPassword: z.string().min(12).max(200) })).mutation(async ({ input }) => {
      if (input.password !== input.confirmPassword) return { success: false as const, message: "كلمتا المرور غير متطابقتين" };
      try { assertPasswordPolicy(input.password); } catch { return { success: false as const, message: "يجب أن تتضمن كلمة المرور 12 حرفاً على الأقل، وحرفاً كبيراً وصغيراً ورقماً" }; }
      const passwordHash = hashInternalPassword(input.password);
      const reset = await resetInternalPasswordWithToken({ token: input.token, passwordHash });
      if (!reset) return { success: false as const, message: "رابط الاستعادة غير صالح أو منتهي أو مستخدم مسبقاً" };
      await recordAuthenticationEvent({ userId: reset.userId, eventType: "password_reset_completed", source: "internal" });
      return { success: true as const, message: "تم تحديث كلمة المرور. يمكنك تسجيل الدخول الآن." };
    }),
    internalLogout: publicProcedure.mutation(async ({ ctx }) => {
      const token = ctx.req.cookies?.[INTERNAL_SESSION_COOKIE];
      if (token) await revokeInternalSession(token);
      ctx.res.clearCookie(INTERNAL_SESSION_COOKIE, { httpOnly: true, sameSite: "lax", secure: isSecureRequest(ctx.req), maxAge: 0, path: "/" });
      return { success: true as const };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
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
  egyptHealthcare: egyptHealthcareRouter,
  reference: router({
    nlmIcd10CmSearch: protectedProcedure.input(z.object({ terms: z.string().min(2).max(120), count: z.number().int().min(1).max(50).optional() })).query(async ({ ctx, input }) => {
      if (!["admin", "manager", "pharmacist"].includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية البحث السريري المرجعي." });
      return {
        authority: "reference-only" as const,
        warning: "NLM ICD-10-CM is a US reference source and does not finalize diagnoses, claims, or billing.",
        results: await searchNlmIcd10Cm(input.terms, { count: input.count }),
      };
    }),
    nlmIcd10CmRefresh: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "تحديث النتائج المخزنة متاح للمسؤولين فقط." });
      clearNlmIcd10Cache();
      await recordAuthenticationEvent({ userId: ctx.user.id, eventType: "cache_refreshed", source: "oauth" });
      return { success: true as const, message: "تم تحديث نتائج NLM المرجعية. سيُعاد جلبها عند البحث التالي.", stats: getNlmIcd10CacheStats() };
    }),
  }),
});

export type AppRouter = typeof appRouter;
