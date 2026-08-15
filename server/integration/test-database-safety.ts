const PRODUCTION_HOST_MARKERS = ["prod", "production", "live", "primary"];
const ISOLATED_DATABASE_MARKER = /(^|[_-])(test|ci|sandbox)([_-]|$)/;

export type IsolatedTestDatabaseConfig = {
  databaseName: string;
};

/**
 * Accept only explicitly-labelled, non-production MySQL databases for test access.
 * The returned structure deliberately excludes credentials and host details so callers
 * can validate eligibility without logging connection information.
 */
export function getIsolatedTestDatabaseConfig(
  url: string | undefined,
  isolationMarker: string | undefined
): IsolatedTestDatabaseConfig | null {
  if (isolationMarker !== "true" || !url) return null;

  try {
    const parsed = new URL(url);
    if (!["mysql:", "mysql2:", "mariadb:"].includes(parsed.protocol))
      return null;

    const host = parsed.hostname.toLowerCase();
    const databaseName = decodeURIComponent(parsed.pathname.replace(/^\//, ""))
      .trim()
      .toLowerCase();
    const user = decodeURIComponent(parsed.username).trim().toLowerCase();

    if (!databaseName || !ISOLATED_DATABASE_MARKER.test(databaseName))
      return null;
    if (user === "root") return null;
    if (
      PRODUCTION_HOST_MARKERS.some(
        marker =>
          host === marker ||
          host.startsWith(`${marker}.`) ||
          host.startsWith(`${marker}-`) ||
          host.includes(`-${marker}-`)
      )
    ) {
      return null;
    }

    return { databaseName };
  } catch {
    return null;
  }
}

export function isIsolatedTestDatabaseUrl(
  url: string | undefined,
  isolationMarker: string | undefined
): boolean {
  return getIsolatedTestDatabaseConfig(url, isolationMarker) !== null;
}

export function isIsolatedTestDatabaseLifecycleEnabled(
  url: string | undefined,
  isolationMarker: string | undefined,
  lifecycleMarker: string | undefined
): boolean {
  return (
    lifecycleMarker === "enabled" &&
    getIsolatedTestDatabaseConfig(url, isolationMarker) !== null
  );
}
