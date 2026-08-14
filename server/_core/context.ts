import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { DEMO_COOKIE_NAME, DEMO_USER, verifyDemoToken } from "./demo";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  isDemo: boolean;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let isDemo = false;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  if (!user && verifyDemoToken(opts.req.cookies?.[DEMO_COOKIE_NAME])) {
    user = DEMO_USER;
    isDemo = true;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    isDemo,
  };
}
