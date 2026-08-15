import type { NextFunction, Request, Response } from "express";

const MAX_RATE_ENTRIES = 10_000;
const WINDOW_MS = 60_000;
const AUTH_LIMIT = 12;
const MUTATION_LIMIT = 240;

type Bucket = { count: number; resetAt: number };

export type SecurityDecision =
  | { allowed: true }
  | { allowed: false; status: 403 | 429; reason: string };

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function normalizedOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password || parsed.pathname !== "/" && parsed.pathname !== "") return undefined;
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return undefined;
  }
}

function requestOrigin(req: Request): string | undefined {
  const forwardedHost = firstHeader(req.headers["x-forwarded-host"]);
  const host = forwardedHost?.split(",")[0]?.trim() || req.get("host");
  if (!host) return undefined;
  const forwardedProto = firstHeader(req.headers["x-forwarded-proto"])?.split(",")[0]?.trim();
  const protocol = forwardedProto === "https" || req.protocol === "https" ? "https" : "http";
  return `${protocol}://${host}`.toLowerCase();
}

export function isTrustedMutationRequest(req: Request): SecurityDecision {
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return { allowed: true };

  const secFetchSite = firstHeader(req.headers["sec-fetch-site"]);
  if (secFetchSite === "cross-site") return { allowed: false, status: 403, reason: "cross-site request blocked" };

  const originHeader = firstHeader(req.headers.origin);
  const refererHeader = firstHeader(req.headers.referer);
  const expected = requestOrigin(req);
  const supplied = normalizedOrigin(originHeader ?? refererHeader);

  // Non-browser clients may omit both headers. Browser requests with an origin
  // or referer must match the current host before cookie-authenticated mutation.
  if ((originHeader || refererHeader) && (!expected || supplied !== expected)) {
    return { allowed: false, status: 403, reason: "request origin rejected" };
  }
  return { allowed: true };
}

function clientKey(req: Request): string {
  const forwarded = firstHeader(req.headers["x-forwarded-for"]);
  return forwarded?.split(",")[0]?.trim() || req.ip || "unknown";
}

function take(bucketMap: Map<string, Bucket>, key: string, limit: number, now: number): boolean {
  if (bucketMap.size >= MAX_RATE_ENTRIES && !bucketMap.has(key)) {
    const oldest = bucketMap.keys().next().value as string | undefined;
    if (oldest) bucketMap.delete(oldest);
  }
  const current = bucketMap.get(key);
  if (!current || current.resetAt <= now) {
    bucketMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function createSecurityMiddleware() {
  const buckets = new Map<string, Bucket>();
  return (req: Request, res: Response, next: NextFunction) => {
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method.toUpperCase());
    const path = req.path;
    const isAuth = path === "/api/trpc/auth.internalLogin" || path === "/api/trpc/auth.requestPasswordReset" || path === "/api/trpc/auth.resetPassword" || path === "/api/oauth/callback";

    const decision = isTrustedMutationRequest(req);
    if (!decision.allowed) {
      res.status(decision.status).json({ error: "Request rejected by security policy" });
      return;
    }

    if (isMutation) {
      const limit = isAuth ? AUTH_LIMIT : MUTATION_LIMIT;
      const key = `${isAuth ? "auth" : "mutation"}:${clientKey(req)}`;
      if (!take(buckets, key, limit, Date.now())) {
        res.set("Retry-After", "60");
        res.status(429).json({ error: "Too many requests" });
        return;
      }
    }

    res.set({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Resource-Policy": "same-origin",
    });
    if (req.protocol === "https" || firstHeader(req.headers["x-forwarded-proto"])?.split(",")[0]?.trim() === "https") {
      res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    if (path.startsWith("/api/") || path.startsWith("/manus-storage/")) res.set("Cache-Control", "no-store");
    next();
  };
}

export const securityInternals = { normalizedOrigin, requestOrigin, take };
