import crypto from "node:crypto";

export const DEMO_COOKIE_NAME = "aldo-demo-session";
const DEMO_TTL_MS = 30 * 60 * 1000;
const DEMO_VERSION = "v1";

type DemoPayload = { version: string; issuedAt: number; expiresAt: number };

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is required for demo sessions");
  return value;
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createDemoToken(now = Date.now()) {
  const payload: DemoPayload = { version: DEMO_VERSION, issuedAt: now, expiresAt: now + DEMO_TTL_MS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyDemoToken(token: string | undefined, now = Date.now()) {
  if (!token) return null;
  const [encoded, provided] = token.split(".");
  if (!encoded || !provided) return null;
  const expected = sign(encoded);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as DemoPayload;
    if (payload.version !== DEMO_VERSION || payload.expiresAt <= now || payload.issuedAt > now + 5000) return null;
    return payload;
  } catch {
    return null;
  }
}

export function demoCookieOptions(req: { secure?: boolean }) {
  return { httpOnly: true, sameSite: "lax" as const, secure: Boolean(req.secure), path: "/", maxAge: DEMO_TTL_MS };
}

export const DEMO_USER = {
  id: -100,
  openId: "aldo-demo-session",
  name: "ALDO Demo",
  email: null,
  loginMethod: "demo",
  role: "user" as const,
  createdAt: new Date(0),
  updatedAt: new Date(0),
  lastSignedIn: new Date(0),
};

export const DEMO_MUTATION_MESSAGE = "وضع العرض التجريبي للقراءة فقط. تواصل معنا لطلب نسخة تشغيلية.";
