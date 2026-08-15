import { spawnSync } from "node:child_process";
import { isIsolatedTestDatabaseLifecycleEnabled } from "../server/integration/test-database-safety";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const databaseUrl = process.env.DATABASE_URL;
const lifecycleEnabled = isIsolatedTestDatabaseLifecycleEnabled(
  testDatabaseUrl,
  process.env.TEST_DATABASE_ISOLATED,
  process.env.TEST_DATABASE_LIFECYCLE
);

if (!lifecycleEnabled || !databaseUrl || databaseUrl !== testDatabaseUrl) {
  throw new Error(
    "Refusing test database migration: DATABASE_URL must exactly match an explicitly isolated TEST_DATABASE_URL and TEST_DATABASE_LIFECYCLE must be enabled."
  );
}

const result = spawnSync(
  process.platform === "win32" ? "pnpm.cmd" : "pnpm",
  ["exec", "drizzle-kit", "migrate"],
  {
    stdio: "inherit",
    env: process.env,
  }
);

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
