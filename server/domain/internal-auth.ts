import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const PASSWORD_MIN_LENGTH = 12;

export const INTERNAL_SESSION_COOKIE = "aldo_internal_session";
export const INTERNAL_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export const INTERNAL_LOCKOUT_MS = 15 * 60 * 1000;
export const INTERNAL_MAX_FAILED_ATTEMPTS = 5;

export type InternalScope = {
  organizationId: number;
  branchId: number;
  jurisdictionId: number;
  role: string;
};

export function assertPasswordPolicy(password: string) {
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    throw new Error("Password does not meet the minimum security policy");
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new Error("Password must include upper, lower, and numeric characters");
  }
  return true as const;
}

export function normalizeInternalUsername(username: string) {
  const normalized = username.trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,80}$/.test(normalized)) throw new Error("Invalid internal username");
  return normalized;
}

export function hashInternalPassword(password: string, salt = randomBytes(16)) {
  assertPasswordPolicy(password);
  const derived = scryptSync(password, salt, KEY_LENGTH, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

export function verifyInternalPassword(password: string, encoded: string) {
  const parts = encoded.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltText, expectedText] = parts;
  const salt = Buffer.from(saltText, "base64url");
  const expected = Buffer.from(expectedText, "base64url");
  if (!salt.length || expected.length !== KEY_LENGTH) return false;
  const actual = scryptSync(password, salt, expected.length, { N: Number(n), r: Number(r), p: Number(p) });
  return timingSafeEqual(actual, expected);
}

export function createInternalSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function hashAuditRecord(input: { previousHash?: string | null; eventType: string; userId?: number | null; username?: string | null; organizationId?: number | null; branchId?: number | null; jurisdictionId?: number | null; requestId?: string | null; createdAt: string }) {
  return createHmac("sha256", process.env.JWT_SECRET ?? "missing-jwt-secret")
    .update(JSON.stringify(input))
    .digest("hex");
}

export function isLocked(lockedUntil: Date | null | undefined, now = new Date()) {
  return Boolean(lockedUntil && lockedUntil.getTime() > now.getTime());
}
