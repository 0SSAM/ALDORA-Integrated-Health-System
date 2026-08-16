import { describe, expect, it } from "vitest";
import { isIsolatedTestDatabaseUrl } from "./integration/test-database-safety";

const baseUrl = process.env.SHOWCASE_TEST_BASE_URL ?? "http://127.0.0.1:3000";
const isolatedDatabaseAvailable = isIsolatedTestDatabaseUrl(
  process.env.TEST_DATABASE_URL,
  process.env.TEST_DATABASE_ISOLATED
);

describe.skipIf(!isolatedDatabaseAvailable)(
  "showcase credential configuration",
  () => {
    it("uses the configured secret when calling the internal login endpoint", async () => {
      const password = process.env.SHOWCASE_TEST_PASSWORD;
      expect(password, "SHOWCASE_TEST_PASSWORD must be supplied").toBeTruthy();
      expect(password!.length).toBeGreaterThanOrEqual(12);
      expect(password).not.toBe("test");

      const response = await fetch(`${baseUrl}/api/trpc/auth.internalLogin`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ json: { username: "test", password } }),
      });
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
    });
  }
);
