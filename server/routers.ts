import { COOKIE_NAME } from "@shared/const";
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

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
});

export type AppRouter = typeof appRouter;
