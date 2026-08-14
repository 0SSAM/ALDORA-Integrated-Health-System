const DEMO_QUERY_ALLOWLIST = new Set(["auth.me", "system.health", "system.getLatestAppVersion"]);

export function isDemoQueryAllowed(path: string) {
  return DEMO_QUERY_ALLOWLIST.has(path);
}

export const DEMO_QUERY_POLICY = {
  mode: "read-only" as const,
  allowlist: ["auth.me", "system.health", "system.getLatestAppVersion"],
};
